import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const DEFAULT_LOADING_LABEL = 'Cargando PDF...';
const DEFAULT_ERROR_LABEL = 'No se pudo cargar el PDF.';

export default function PdfViewer({
  src,
  loadingLabel = DEFAULT_LOADING_LABEL,
  errorLabel = DEFAULT_ERROR_LABEL,
  className = '',
  viewerClassName = '',
  canvasClassName = '',
}) {
  const wrapperRef = useRef(null);
  const viewerRef = useRef(null);
  const canvasRefs = useRef([]);
  const pdfDocRef = useRef(null);
  const renderTokenRef = useRef(0);
  const hideTimerRef = useRef(null);
  const pinchStateRef = useRef({
    startDistance: 0,
    startZoom: 1,
    focusX: 0,
    focusY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });
  const previousZoomRef = useRef(1);

  const [pageCount, setPageCount] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const showControls = () => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), 5000);
  };

  useEffect(() => {
    let cancelled = false;

    const cleanupPdf = async () => {
      pdfDocRef.current = null;
    };

    const loadPdf = async () => {
      setLoading(true);
      setError('');
      setPageCount(0);
      pdfDocRef.current = null;
      canvasRefs.current = [];

      try {
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`No se pudo cargar el PDF: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
        if (cancelled) {
          return;
        }

        pdfDocRef.current = doc;
        setPageCount(doc.numPages);
        setLoading(false);
        showControls();
      } catch (loadError) {
        if (!cancelled) {
          console.error('Error loading PDF:', loadError);
          setError(errorLabel);
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      cleanupPdf();
    };
  }, [src, errorLabel]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return undefined;

    const updateWidth = () => {
      setContainerWidth(el.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return undefined;

    const getDistance = (touches) => {
      const [first, second] = touches;
      const dx = second.clientX - first.clientX;
      const dy = second.clientY - first.clientY;
      return Math.hypot(dx, dy);
    };

    const handleTouchStart = (event) => {
      if (event.touches.length !== 2) return;

      const container = viewerRef.current;
      const rect = container?.getBoundingClientRect();
      const centroidX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
      const centroidY = (event.touches[0].clientY + event.touches[1].clientY) / 2;

      pinchStateRef.current = {
        startDistance: getDistance(event.touches),
        startZoom: zoom,
        focusX: rect ? container.scrollLeft + (centroidX - rect.left) : 0,
        focusY: rect ? container.scrollTop + (centroidY - rect.top) : 0,
        scrollLeft: container?.scrollLeft ?? 0,
        scrollTop: container?.scrollTop ?? 0,
      };
    };

    const handleTouchMove = (event) => {
      if (event.touches.length !== 2) return;

      event.preventDefault();
      const currentDistance = getDistance(event.touches);
      const { startDistance, startZoom } = pinchStateRef.current;

      if (!startDistance) return;

      const scaleFactor = currentDistance / startDistance;
      const nextZoom = Math.min(2, Math.max(0.75, +(startZoom * scaleFactor).toFixed(2)));
      setZoom(nextZoom);
    };

    const handleTouchEnd = (event) => {
      if (event.touches.length < 2) {
        pinchStateRef.current = {
          startDistance: 0,
          startZoom: zoom,
          focusX: 0,
          focusY: 0,
          scrollLeft: viewerRef.current?.scrollLeft ?? 0,
          scrollTop: viewerRef.current?.scrollTop ?? 0,
        };
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    el.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [zoom]);

  useEffect(() => {
    const container = viewerRef.current;
    if (!container) return undefined;

    const handleScroll = () => {
      showControls();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const renderPages = async () => {
      const pdfDoc = pdfDocRef.current;
      if (!pdfDoc || !pageCount || !containerWidth) return;

      const token = ++renderTokenRef.current;
      const dpr = window.devicePixelRatio || 1;
      const availableWidth = Math.max(240, containerWidth - 16);

      for (let index = 1; index <= pageCount; index += 1) {
        if (token !== renderTokenRef.current) return;

        const page = await pdfDoc.getPage(index);
        const baseViewport = page.getViewport({ scale: 1 });
        const scale = (availableWidth * zoom) / baseViewport.width;
        const viewport = page.getViewport({ scale });
        const canvas = canvasRefs.current[index - 1];

        if (!canvas) continue;

        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        await page.render({
          canvasContext: context,
          viewport,
          transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
        }).promise;
      }
    };

    renderPages();
  }, [pageCount, containerWidth, zoom]);

  useEffect(() => {
    const container = viewerRef.current;
    const pinchState = pinchStateRef.current;
    const previousZoom = previousZoomRef.current;

    if (!container || !pinchState.startDistance || previousZoom === zoom) {
      previousZoomRef.current = zoom;
      return undefined;
    }

    const ratio = zoom / previousZoom;
    const nextScrollLeft = pinchState.focusX * ratio - (pinchState.focusX - pinchState.scrollLeft);
    const nextScrollTop = pinchState.focusY * ratio - (pinchState.focusY - pinchState.scrollTop);

    const raf = window.requestAnimationFrame(() => {
      container.scrollLeft = Number.isFinite(nextScrollLeft) ? Math.max(0, nextScrollLeft) : container.scrollLeft;
      container.scrollTop = Number.isFinite(nextScrollTop) ? Math.max(0, nextScrollTop) : container.scrollTop;
    });

    previousZoomRef.current = zoom;

    return () => window.cancelAnimationFrame(raf);
  }, [zoom]);

  return (
    <div
      ref={wrapperRef}
      className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-md dark:border-white/10 dark:bg-gray-900/80 ${className}`}
      onPointerDown={showControls}
      onTouchStart={showControls}
    >
      <div
        ref={viewerRef}
        className={`flex-1 min-h-0 overflow-auto px-2 py-2 ${viewerClassName}`}
        style={{ touchAction: 'pan-x pan-y' }}
      >
        {loading ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-black/5 text-sm font-semibold text-gray-600 dark:bg-white/5 dark:text-gray-300">
            {loadingLabel}
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center rounded-xl bg-black/5 px-4 text-center text-sm font-semibold text-gray-600 dark:bg-white/5 dark:text-gray-300">
            {error}
          </div>
        ) : (
          <div className="flex min-w-max flex-col gap-3">
            {Array.from({ length: pageCount }).map((_, index) => (
              <canvas
                key={`page-${index + 1}`}
                ref={(el) => {
                  canvasRefs.current[index] = el;
                }}
                className={`mx-auto block rounded-lg bg-white shadow-sm ${canvasClassName}`}
              />
            ))}
          </div>
        )}
      </div>

      <div
        className={`fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/70 px-2 py-1 text-white shadow-xl shadow-black/30 backdrop-blur touch-none transition-opacity duration-200 ${
          controlsVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={() => {
            setZoom((prev) => Math.max(0.75, +(prev - 0.15).toFixed(2)));
            showControls();
          }}
          className="h-7 rounded-full bg-rose-500 px-3 text-sm font-black leading-none text-white shadow-sm shadow-rose-500/40 transition-colors hover:bg-rose-400"
        >
          -
        </button>
        <button
          type="button"
          onClick={() => {
            setZoom(1);
            showControls();
          }}
          className="h-7 rounded-full bg-amber-500 px-2.5 text-[10px] font-black leading-none text-white shadow-sm shadow-amber-500/40 transition-colors hover:bg-amber-400"
        >
          100%
        </button>
        <button
          type="button"
          onClick={() => {
            setZoom((prev) => Math.min(2, +(prev + 0.15).toFixed(2)));
            showControls();
          }}
          className="h-7 rounded-full bg-emerald-500 px-3 text-sm font-black leading-none text-white shadow-sm shadow-emerald-500/40 transition-colors hover:bg-emerald-400"
        >
          +
        </button>
      </div>
    </div>
  );
}
