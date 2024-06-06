import dash_dragrect_figure
import dash

app = dash.Dash(__name__)

app.layout = dash_dragrect_figure.DragRectFigure(
    id='component',
    data=[
        {
          'x': [1, 2, 3, 4, 5],
          'y': [1, 2, 3, 4, 5],
          'mode': 'markers',
          'type': 'scatter',
        },
    ],
    layout={
        'title': 'Plotly Figure with Draggable Bounding Box',
        'dragmode': 'zoom',
        'xaxis': {
            'scaleanchor': 'y',
            'scaleratio': 1
        },
        'yaxis': {
            'scaleanchor': 'x',
            'scaleratio': 1
        }
    }
)


if __name__ == '__main__':
    app.run_server(debug=True)
