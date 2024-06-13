import dash
from dash import html, dcc, Input, Output, State
from plotly.io import to_json
import json

import plotly.graph_objects as go

import plotly.graph_objects as go

class CustomFigure(go.Figure):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def add_image(self, image_url):
        self.add_layout_image(
            dict(
                source=image_url,
                xref="x",
                yref="y",
                x=0,
                y=0,
                sizex=10,
                sizey=10,
                sizing="stretch",
                opacity=1,
                layer="below"
            )
        )

    def update_rectangle(self, x0, y0, x1, y1):
        self.update_layout(
            shapes=[
                {
                    'type': 'rect',
                    'xref': 'x',
                    'yref': 'y',
                    'x0': x0,
                    'y0': y0,
                    'x1': x1,
                    'y1': y1,
                    'line': {
                        'color': 'red',
                        'width': 2
                    }
                }
            ]
        )

    def handle_relayout(self, relayout_data):
        if 'shapes[0].x0' in relayout_data:
            self.update_rectangle(
                relayout_data['shapes[0].x0'],
                relayout_data['shapes[0].y0'],
                relayout_data['shapes[0].x1'],
                relayout_data['shapes[0].y1']
            )

# Create a Dash application
app = dash.Dash(__name__)

# Instantiate the custom figure
fig = CustomFigure()
fig.add_trace(go.Scatter(x=[1, 2, 3], y=[4, 5, 6]))
fig.add_image('https://example.com/image.png')
fig.update_rectangle(1, 1, 2, 2)

app.layout = html.Div([
    dcc.Graph(
        id='graph',
        figure=fig
    ),
    html.Div(id='output', style={'display': 'none'})
])

# Add a client-side callback to handle dragging
app.clientside_callback(
    """
    function(relayoutData) {
        if (relayoutData && 'shapes[0].x0' in relayoutData) {
            let coords = {
                x0: relayoutData['shapes[0].x0'],
                y0: relayoutData['shapes[0].y0'],
                x1: relayoutData['shapes[0].x1'],
                y1: relayoutData['shapes[0].y1']
            };
            return JSON.stringify(coords);
        }
        return null;
    }
    """,
    Output('output', 'children'),
    Input('graph', 'relayoutData')
)

@app.callback(
    Output('graph', 'figure'),
    Input('output', 'children'),
    State('graph', 'figure')
)
def update_figure(coords_json, figure_json):
    if coords_json:
        coords = json.loads(coords_json)
        fig = CustomFigure(figure_json)
        fig.handle_relayout(coords)
        return json.loads(to_json(fig))
    return figure_json

if __name__ == '__main__':
    app.run_server(debug=True)