import React, { useEffect, useRef, useState } from 'react';
import { DashComponentProps } from '../props';
import Plot, { PlotParams } from 'react-plotly.js';

type Props = {
    // Insert props
} & DashComponentProps & PlotParams;

/**
 * A Plotly figure that allows dragging of rectangle within the plot,
 * without allowing resizing of the rectangle.
 */
const DragRectFigure = (props: Props) => {
    const {...restProps} = props;
    const plotRef = useRef(null);
    const rectRef = useRef(null);
    const [currentRect, setCurrentRect] = useState({ x0: 1, y0: 1, x1: 2, y1: 2 });
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const plot = plotRef.current;
        if (!plot || !plot.querySelector) return;

        if (!rectRef.current) {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('fill', 'none');
            rect.setAttribute('stroke', 'red');
            rect.setAttribute('stroke-width', '2');
            rect.style.cursor = 'move';
            rect.style.pointerEvents = 'all';
            rectRef.current = rect;
            const svg = plot.querySelector('svg')
            if (!svg) return;
            svg.appendChild(rect);
        }

        const rect = rectRef.current;

        const updateRect = (x0, y0, x1, y1) => {
            const xScale = plot._fullLayout.xaxis._length / (plot._fullLayout.xaxis.range[1] - plot._fullLayout.xaxis.range[0]);
            const yScale = plot._fullLayout.yaxis._length / (plot._fullLayout.yaxis.range[1] - plot._fullLayout.yaxis.range[0]);

            const x = (x0 - plot._fullLayout.xaxis.range[0]) * xScale + plot._fullLayout.margin.l;
            const y = plot._fullLayout.height - ((y1 - plot._fullLayout.yaxis.range[0]) * yScale + plot._fullLayout.margin.b);
            const width = (x1 - x0) * xScale;
            const height = (y1 - y0) * yScale;

            rect.setAttribute('x', String(x));
            rect.setAttribute('y', String(y));
            rect.setAttribute('width', String(width));
            rect.setAttribute('height', String(height));
        };

        updateRect(currentRect.x0, currentRect.y0, currentRect.x1, currentRect.y1);

        const handleMouseDown = (e) => {
            setIsDragging(true);
            setOffset({ x: e.clientX - parseFloat(rect.getAttribute('x')), y: e.clientY - parseFloat(rect.getAttribute('y')) });
        };

        const handleMouseMove = (e) => {
            if (isDragging) {
                const x = e.clientX - offset.x;
                const y = e.clientY - offset.y;
                const x0 = plot._fullLayout.xaxis.range[0] + (x - plot._fullLayout.margin.l) / plot._fullLayout.xaxis._length * (plot._fullLayout.xaxis.range[1] - plot._fullLayout.xaxis.range[0]);
                const y1 = plot._fullLayout.yaxis.range[0] + (plot._fullLayout.height - y - plot._fullLayout.margin.b) / plot._fullLayout.yaxis._length * (plot._fullLayout.yaxis.range[1] - plot._fullLayout.yaxis.range[0]);
                const width = parseFloat(rect.getAttribute('width'));
                const height = parseFloat(rect.getAttribute('height'));

                const newRect = {
                    x0: x0,
                    y0: y1 - height / plot._fullLayout.yaxis._length * (plot._fullLayout.yaxis.range[1] - plot._fullLayout.yaxis.range[0]),
                    x1: x0 + width / plot._fullLayout.xaxis._length * (plot._fullLayout.xaxis.range[1] - plot._fullLayout.xaxis.range[0]),
                    y1: y1
                };

                setCurrentRect(newRect);
                updateRect(newRect.x0, newRect.y0, newRect.x1, newRect.y1);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        rect.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        plot.on('plotly_relayout', () => {
            updateRect(currentRect.x0, currentRect.y0, currentRect.x1, currentRect.y1);
        });

        return () => {
            rect.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [plotRef, currentRect, isDragging, offset]);

    return (
        <div ref={plotRef}>
            <Plot
                style={{ width: '800px', height: '800px' }}
                onInitialized={(figure, graphDiv) => {
                    plotRef.current = graphDiv;
                }}
                onUpdate={(figure, graphDiv) => {
                    plotRef.current = graphDiv;
                }}
                {...restProps}
            />
        </div>
    )
}

DragRectFigure.defaultProps = {};

export default DragRectFigure;
