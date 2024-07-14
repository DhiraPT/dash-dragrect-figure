import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DashComponentProps } from '../props';
import Plot, { PlotParams } from 'react-plotly.js';
import Plotly from 'plotly.js';
import { useResizeDetector } from 'react-resize-detector';

type Props = {
    isWithRect: boolean;
    rectWidth: number;
    rectHeight: number;
    rectColor: string;
    image: {
        imageData: string;
        width: number;
        height: number;
    } | null;
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
    const initialLayout = useRef(null);
    const { width, height, ref } = useResizeDetector();

    const attachEventListeners = () => {
        if (!plotRef.current) {
            return;
        }
        
        const shapeGroup = plotRef.current.querySelector('.shape-group');

        if (!shapeGroup) {
            // console.log('Rectangle not drawn.');
        } else {
            rectRef.current = shapeGroup.firstChild;

            if (rectRef.current) {
                rectRef.current.style.cursor = 'move';
                rectRef.current.style.pointerEvents = 'all';

                rectRef.current.addEventListener('click', handleOnRectClick);
                plotRef.current.addEventListener('click', handleOnPlotClick);

                return () => {
                    rectRef.current.removeEventListener('click', handleOnRectClick);
                    plotRef.current.removeEventListener('click', handleOnPlotClick);
                }
            }
        }
    }

    const removeOutlineControllers = () => {
        if (!plotRef.current) {
            return;
        }

        const outlineControllers = plotRef.current.querySelectorAll('.outline-controllers');
        if (outlineControllers.length === 0) {
            // console.log('Outline controllers not found.');
        } else {
            if (outlineControllers[0]) {
                outlineControllers[0].remove();
            } else {
                // console.error('Outline controllers[0] not found.');
            }
        }
    }

    const handleOnRectClick = (e) => {
        setTimeout(() => {
            removeOutlineControllers();
        }, 0);
    }

    const handleOnPlotClick = (e) => {
        attachEventListeners();
    }

    const calculateHeight = (width: number) => {
        if (!initialLayout.current) {
            return height;
        }

        const aspectRatio = initialLayout.current.height / initialLayout.current.width;
        return width * aspectRatio;
    }
    
    useEffect(() => {
        if (!plotRef.current || !initialLayout.current) {
            return;
        }

        if (props.image) {
            props.setProps({
                data: [{
                    x: [0, props.image.width],
                    y: [0, props.image.height],
                    mode: "markers",
                    opacity: 0,
                }],
                layout: {
                    ...props.layout,
                    xaxis: {
                        ...props.layout.xaxis,
                        showTickLabels: false,
                        showGrid: false,
                        zeroLine: false,
                        visible: false,
                        range: [0, props.image.width],
                    },
                    yaxis: {
                        ...props.layout.yaxis,
                        showTickLabels: false,
                        showGrid: false,
                        zeroline: false,
                        visible: false,
                        range: [0, props.image.height],
                    },
                    margin: {
                        l: 0,
                        r: 0,
                        b: 0,
                        t: 0,
                        pad: 0
                    },
                    images: [{
                        source: props.image.imageData,
                        xref: 'x',
                        yref: 'y',
                        x: 0,
                        y: props.image.height,
                        sizex: props.image.width,
                        sizey: props.image.height,
                        opacity: 1,
                        layer: 'below',
                        sizing: 'stretch',
                    }],
                }
            });
        } else {
            rectRef.current = null;
            // Reset layout when image is removed
            props.setProps({
                data: [],
                layout: {
                    ...initialLayout.current,
                    width: width,
                    height: calculateHeight(width),
                }
            });
        }
    }, [props.image]);

    useEffect(() => {
        if (!plotRef.current || !props.image || !props.isWithRect) {
            return;
        }

        const xRange = props.layout.xaxis.range;
        const yRange = props.layout.yaxis.range;

        const xImageScale = (xRange[1] - xRange[0]) / props.image.width;
        const yImageScale = (yRange[1] - yRange[0]) / props.image.height;

        const x0 = props.xy ? xRange[0] + (props.xy.x - props.rectWidth / 2) * xImageScale : (xRange[0] + xRange[1]) / 2 - props.rectWidth * xImageScale / 2;
        const y0 = props.xy ? yRange[1] - (props.xy.y - props.rectHeight / 2) * yImageScale : (yRange[0] + yRange[1]) / 2 + props.rectHeight * yImageScale / 2;
        const x1 = props.xy ? xRange[0] + (props.xy.x + props.rectWidth / 2) * xImageScale : (xRange[0] + xRange[1]) / 2 + props.rectWidth * xImageScale / 2;
        const y1 = props.xy ? yRange[1] - (props.xy.y + props.rectHeight / 2) * yImageScale : (yRange[0] + yRange[1]) / 2 - props.rectHeight * yImageScale / 2;
        
        props.setProps({
            layout: {
                ...props.layout,
                shapes: [{
                    type: 'rect',
                    xref: 'x',
                    yref: 'y',
                    x0: x0,
                    y0: y0,
                    x1: x1,
                    y1: y1,
                    line: {
                        color: props.rectColor,
                    },
                    editable: true,
                }]
            }
        });
    }, [props.isWithRect]);

    useLayoutEffect(() => {
        if (plotRef.current && props.layout.shapes && !rectRef.current) {
            // Using a timeout to ensure all DOM mutations are complete
            setTimeout(() => {
                attachEventListeners();
            }, 0);
        }
    }, [props.layout.shapes]);

    const handleInitialized = (figure, graphDiv) => {
        // console.log('Initialized');
        plotRef.current = graphDiv;
        initialLayout.current = {
            ...props.layout,
            xaxis: {
                ...props.layout.xaxis,
                range: JSON.parse(JSON.stringify(props.layout.xaxis.range)),
                scaleratio: 1,
            },
            yaxis: {
                ...props.layout.yaxis,
                range: JSON.parse(JSON.stringify(props.layout.yaxis.range)),
                scaleratio: 1,
                scaleanchor: 'x',
            },
            width: graphDiv.clientWidth,
            height: graphDiv.clientHeight,
        };
        props.setProps({layout: initialLayout.current});
    }

    const handleRelayout = (event) => {
        // Reattach event listeners after a relayout event
        attachEventListeners();
        // Remove outline controllers after a relayout event
        removeOutlineControllers();
    }

    const handleOnUpdate = (figure) => {
        // Reattach event listeners after an update event
        attachEventListeners();
        // Remove outline controllers after an update event
        removeOutlineControllers();
    }

    useEffect(() => {
        if (props.getXY) {
            if (rectRef.current) {
                const xy = {
                    x: (Number(props.layout.shapes[0].x0) + Number(props.layout.shapes[0].x1)) / 2,
                    y: (Number(props.layout.shapes[0].y0) + Number(props.layout.shapes[0].y1)) / 2
                };
                
                props.setProps({xy: {x: xy.x, y: props.image.height - xy.y}});
            }
            props.setProps({getXY: false});
        }
    }, [props.getXY]);

    useEffect(() => {
        if (!plotRef.current) {
            return;
        }

        props.setProps({
            layout: {
                ...props.layout,
                xaxis: {
                    ...props.layout.xaxis,
                    range: JSON.parse(JSON.stringify(props.layout.xaxis.range)),
                },
                yaxis: {
                    ...props.layout.yaxis,
                    range: JSON.parse(JSON.stringify(props.layout.yaxis.range)),
                },
                width: width,
                height: calculateHeight(width),
            }
        });
    }, [width]);

    return (
        <div ref={ref} style={{ width: '100%', height: '100%' }}>
            <Plot
                onInitialized={handleInitialized}
                onUpdate={handleOnUpdate}
                onRelayout={handleRelayout}
                config={{doubleClick: 'reset'}}
                {...restProps}
            />
        </div>
    )
}

DragRectFigure.defaultProps = {
    data: [],
    layout: {},
    isWithRect: false,
    rectWidth: 200,
    rectHeight: 200,
    rectColor: 'black',
    image: null,
    getXY: false,
    xy: null,
};

export default DragRectFigure;
