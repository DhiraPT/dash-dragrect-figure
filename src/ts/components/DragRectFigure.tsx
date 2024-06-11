import React, { useEffect, useRef, useState } from 'react';
import { DashComponentProps } from '../props';
import Plot, { PlotParams } from 'react-plotly.js';
import { react } from 'plotly.js';

type Props = {
    rectColor: string;
    strokeWidth: number;
    rectWidth: number;
    rectHeight: number;
    getXY: boolean;
    xy: { x: number, y: number } | null;
} & DashComponentProps & PlotParams;

/**
 * A Plotly figure that allows dragging of rectangle within the plot,
 * without allowing resizing of the rectangle.
 */
const DragRectFigure = (props: Props) => {
    const {...restProps} = props;
    const plotRef = useRef(null);
    const rectRef = useRef(null);
    const mouseRef = useRef<{ x: number, y: number } | null>(null);
    const isDragging = useRef(false);
    const rectCoordsRef = useRef(null);
    const initialLayout = useRef(null);
    const beforeDragCoords = useRef(null);
    const centerXY = useRef(null);

    /**
     * Updates the actual rectangle element clientX and clientY with the given coordinates.
     * @param x0 The x-coordinate of the top-left corner of the rectangle.
     * @param y0 The y-coordinate of the top-left corner of the rectangle.
     * @param x1 The x-coordinate of the bottom-right corner of the rectangle.
     * @param y1 The y-coordinate of the bottom-right corner of the rectangle.
     */
    const updateRect = (x0: number, y0: number, x1: number, y1: number) => {
        const plot = plotRef.current;
        if (!plot) return;

        rectCoordsRef.current = {x0, y0, x1, y1};
        const xScale = plot._fullLayout.xaxis._length / (plot._fullLayout.xaxis.range[1] - plot._fullLayout.xaxis.range[0]);
        const yScale = plot._fullLayout.yaxis._length / (plot._fullLayout.yaxis.range[1] - plot._fullLayout.yaxis.range[0]);

        const x = (x0 - plot._fullLayout.xaxis.range[0]) * xScale + plot._fullLayout.margin.l;
        const y = plot._fullLayout.height - ((y0 - plot._fullLayout.yaxis.range[0]) * yScale + plot._fullLayout.margin.b);
        const width = (x1 - x0) * xScale;
        const height = (y0 - y1) * yScale;

        if (rectRef.current) {
            rectRef.current.setAttribute('x', String(x));
            rectRef.current.setAttribute('y', String(y));
            rectRef.current.setAttribute('width', String(width));
            rectRef.current.setAttribute('height', String(height));
        }
        
    };

    const handleMouseDown = (e: { clientX: number; clientY: number; }) => {
        isDragging.current = true;
        const plotBBox = plotRef.current.getBoundingClientRect();
        const x = e.clientX - plotBBox.left;
        const y = e.clientY - plotBBox.top;
        mouseRef.current = {x: x, y: y};

        beforeDragCoords.current = { ...rectCoordsRef.current }
    };

    const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
        if (isDragging.current && rectRef.current && rectCoordsRef.current) {
            const plot = plotRef.current;
            if (!plot) return;

            const plotBBox = plot.getBoundingClientRect();
            const x = e.clientX - plotBBox.left;
            const y = e.clientY - plotBBox.top;
            const dx = x - mouseRef.current.x;
            const dy = y - mouseRef.current.y;

            const newRect = {
                x0: rectCoordsRef.current.x0 + dx / plot._fullLayout.xaxis._length * (plot._fullLayout.xaxis.range[1] - plot._fullLayout.xaxis.range[0]),
                y0: rectCoordsRef.current.y0 - dy / plot._fullLayout.yaxis._length * (plot._fullLayout.yaxis.range[1] - plot._fullLayout.yaxis.range[0]),
                x1: rectCoordsRef.current.x1 + dx / plot._fullLayout.xaxis._length * (plot._fullLayout.xaxis.range[1] - plot._fullLayout.xaxis.range[0]),
                y1: rectCoordsRef.current.y1 - dy / plot._fullLayout.yaxis._length * (plot._fullLayout.yaxis.range[1] - plot._fullLayout.yaxis.range[0])
            }; 
            
            updateRect(newRect.x0, newRect.y0, newRect.x1, newRect.y1);
            mouseRef.current = {x: x, y: y};
        }
    };

    const handleMouseUp = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        
        const initialXScale = initialLayout.current.xaxis._length / (initialLayout.current.xaxis.range[1] - initialLayout.current.xaxis.range[0]);
        const initialYScale = initialLayout.current.yaxis._length / (initialLayout.current.yaxis.range[1] - initialLayout.current.yaxis.range[0]);

        const dCenterX = ((rectCoordsRef.current.x0 + rectCoordsRef.current.x1) / 2 - (beforeDragCoords.current.x0 + beforeDragCoords.current.x1) / 2) * initialXScale;
        const dCenterY = -((rectCoordsRef.current.y0 + rectCoordsRef.current.y1) / 2 - (beforeDragCoords.current.y0 + beforeDragCoords.current.y1) / 2) * initialYScale;
        
        const newXY = {x: centerXY.current.x + dCenterX, y: centerXY.current.y + dCenterY};
        
        centerXY.current = newXY;
    };

    useEffect(() => {
        init();
        if (!initialLayout.current && plotRef.current) {
            initialLayout.current = {
                xaxis: {
                    range: JSON.parse(JSON.stringify(plotRef.current._fullLayout.xaxis.range)),
                    _length: plotRef.current._fullLayout.xaxis._length
                },
                yaxis: {
                    range: JSON.parse(JSON.stringify(plotRef.current._fullLayout.yaxis.range)),
                    _length: plotRef.current._fullLayout.yaxis._length
                }
            }
        }
    }, [plotRef]);

    const init = () => {
        const plot = plotRef.current;
        if (!plot || (rectRef.current && rectCoordsRef.current)) return;

        const xCoord = (plot._fullLayout.xaxis.range[0] + plot._fullLayout.xaxis.range[1]) / 2;
        const yCoord = (plot._fullLayout.yaxis.range[0] + plot._fullLayout.yaxis.range[1]) / 2;

        const xScale = plot._fullLayout.xaxis._length / (plot._fullLayout.xaxis.range[1] - plot._fullLayout.xaxis.range[0]);
        const yScale = plot._fullLayout.yaxis._length / (plot._fullLayout.yaxis.range[1] - plot._fullLayout.yaxis.range[0]);

        const newRect = {
            x0: xCoord - props.rectWidth / 2 / xScale,
            y0: yCoord + props.rectHeight / 2 / yScale,
            x1: xCoord + props.rectWidth / 2 / xScale,
            y1: yCoord - props.rectHeight / 2 / yScale
        };

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('fill', 'none');
        rect.setAttribute('stroke', props.rectColor);
        rect.setAttribute('stroke-width', props.strokeWidth.toString());
        rect.style.cursor = 'move';
        rect.style.pointerEvents = 'all';
        rectRef.current = rect;
        const glimages = plot.querySelector('.glimages');
        
        if (glimages) {
            glimages.appendChild(rect);
            rectRef.current.addEventListener('mousedown', handleMouseDown);
            rectRef.current.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        updateRect(newRect.x0, newRect.y0, newRect.x1, newRect.y1);
        centerXY.current = {
            x: (xCoord - plot._fullLayout.xaxis.range[0]) * xScale + plot._fullLayout.margin.l,
            y: plot._fullLayout.height - ((yCoord - plot._fullLayout.yaxis.range[0]) * yScale + plot._fullLayout.margin.b)
        };
    };

    const handleRelayout = (event) => {
        if (rectCoordsRef.current) {
            updateRect(rectCoordsRef.current.x0, rectCoordsRef.current.y0, rectCoordsRef.current.x1, rectCoordsRef.current.y1);
        }
    };

    useEffect(() => {
        if (props.getXY) {
            const xy = centerXY.current;
            props.setProps({xy: xy});
            props.setProps({getXY: false});
        }
    }, [props.getXY]);

    return (
        <Plot
            onInitialized={(figure, graphDiv) => {
                plotRef.current = graphDiv;
            }}
            onUpdate={(figure, graphDiv) => {
                plotRef.current = graphDiv;
            }}
            onRelayout={handleRelayout}
            {...restProps}
        />
    )
}

DragRectFigure.defaultProps = {
    rectColor: 'red',
    strokeWidth: 2,
    rectWidth: 200,
    rectHeight: 200,
    getXY: false,
    xy: null
};

export default DragRectFigure;
