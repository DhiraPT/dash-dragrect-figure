# AUTO GENERATED FILE - DO NOT EDIT

#' @export
''DragRectFigure <- function(id=NULL, className=NULL, config=NULL, data=NULL, debug=NULL, divId=NULL, frames=NULL, getXY=NULL, image=NULL, isWithRect=NULL, layout=NULL, nonEditableRects=NULL, onAfterExport=NULL, onAfterPlot=NULL, onAnimated=NULL, onAnimatingFrame=NULL, onAnimationInterrupted=NULL, onAutoSize=NULL, onBeforeExport=NULL, onBeforeHover=NULL, onButtonClicked=NULL, onClick=NULL, onClickAnnotation=NULL, onDeselect=NULL, onDoubleClick=NULL, onError=NULL, onFramework=NULL, onHover=NULL, onInitialized=NULL, onLegendClick=NULL, onLegendDoubleClick=NULL, onPurge=NULL, onRedraw=NULL, onRelayout=NULL, onRestyle=NULL, onSelected=NULL, onSelecting=NULL, onSliderChange=NULL, onSliderEnd=NULL, onSliderStart=NULL, onTransitionInterrupted=NULL, onTransitioning=NULL, onUnhover=NULL, onUpdate=NULL, onWebGlContextLost=NULL, rectColor=NULL, rectHeight=NULL, rectWidth=NULL, revision=NULL, style=NULL, useResizeHandler=NULL, xy=NULL) {
    
    props <- list(id=id, className=className, config=config, data=data, debug=debug, divId=divId, frames=frames, getXY=getXY, image=image, isWithRect=isWithRect, layout=layout, nonEditableRects=nonEditableRects, onAfterExport=onAfterExport, onAfterPlot=onAfterPlot, onAnimated=onAnimated, onAnimatingFrame=onAnimatingFrame, onAnimationInterrupted=onAnimationInterrupted, onAutoSize=onAutoSize, onBeforeExport=onBeforeExport, onBeforeHover=onBeforeHover, onButtonClicked=onButtonClicked, onClick=onClick, onClickAnnotation=onClickAnnotation, onDeselect=onDeselect, onDoubleClick=onDoubleClick, onError=onError, onFramework=onFramework, onHover=onHover, onInitialized=onInitialized, onLegendClick=onLegendClick, onLegendDoubleClick=onLegendDoubleClick, onPurge=onPurge, onRedraw=onRedraw, onRelayout=onRelayout, onRestyle=onRestyle, onSelected=onSelected, onSelecting=onSelecting, onSliderChange=onSliderChange, onSliderEnd=onSliderEnd, onSliderStart=onSliderStart, onTransitionInterrupted=onTransitionInterrupted, onTransitioning=onTransitioning, onUnhover=onUnhover, onUpdate=onUpdate, onWebGlContextLost=onWebGlContextLost, rectColor=rectColor, rectHeight=rectHeight, rectWidth=rectWidth, revision=revision, style=style, useResizeHandler=useResizeHandler, xy=xy)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'DragRectFigure',
        namespace = 'dash_dragrect_figure',
        propNames = c('id', 'className', 'config', 'data', 'debug', 'divId', 'frames', 'getXY', 'image', 'isWithRect', 'layout', 'nonEditableRects', 'onAfterExport', 'onAfterPlot', 'onAnimated', 'onAnimatingFrame', 'onAnimationInterrupted', 'onAutoSize', 'onBeforeExport', 'onBeforeHover', 'onButtonClicked', 'onClick', 'onClickAnnotation', 'onDeselect', 'onDoubleClick', 'onError', 'onFramework', 'onHover', 'onInitialized', 'onLegendClick', 'onLegendDoubleClick', 'onPurge', 'onRedraw', 'onRelayout', 'onRestyle', 'onSelected', 'onSelecting', 'onSliderChange', 'onSliderEnd', 'onSliderStart', 'onTransitionInterrupted', 'onTransitioning', 'onUnhover', 'onUpdate', 'onWebGlContextLost', 'rectColor', 'rectHeight', 'rectWidth', 'revision', 'style', 'useResizeHandler', 'xy'),
        package = 'dashDragrectFigure'
        )

    structure(component, class = c('dash_component', 'list'))
}
