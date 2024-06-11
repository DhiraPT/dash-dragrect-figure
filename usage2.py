import dash_dragrect_figure
import dash
from dash import html, Output, Input, ctx
import dash_bootstrap_components as dbc

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])

app.layout = dbc.Container(children=[
    dbc.Card([
        dbc.CardBody(children=[
            dash_dragrect_figure.DragRectFigure(
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
                },
            ),
            html.Div(id='modal-container')
    ]),
    dbc.CardFooter(children=[
        html.Div(id='output'),
        dbc.Button('Add', id='btn-add', color='primary', className='me-2'),
        dbc.Button('Edit', id='btn-edit', color='primary'),
        dbc.Button('Get XY', id='get-xy-button', color='primary'),
    ])
])])


@app.callback(
    Output('modal-container', 'children'),
    Input('btn-add', 'n_clicks'),
    Input('btn-edit', 'n_clicks'),
    prevent_initial_call=True,
)
def on_btn_shot_click(add_clicks, edit_clicks):
    triggered_id = ctx.triggered_id
    if triggered_id == 'btn-add':
        return dbc.Modal(
            [
                dbc.ModalHeader(
                    dbc.ModalTitle('Add', id='modal-shot-title')
                ),
                dbc.ModalBody([
                    html.Div(className='mb-3 d-flex', children=[
                        dbc.Label('Shot code:', className='my-1'),
                        dbc.Input(id='modal-input-shot-code', type='text',
                                size='sm', style={'width': '130px'}, className='mx-1'),
                    ]),
                ]),
                dbc.ModalFooter([
                    dbc.Label('', id='modal-save-shot-status'),
                    dbc.Button("Save", id="modal-btn-save-shot", className="ms-auto"),
                ]),
            ],
            id="modal-shot",
            is_open=True,
            backdrop='static',
            centered=True
        )
    elif triggered_id == 'btn-edit':
        return dbc.Modal(
            [
                dbc.ModalHeader(
                    dbc.ModalTitle('Edit', id='modal-shot-title')
                ),
                dbc.ModalBody([
                    html.Div(className='mb-3 d-flex', children=[
                        dbc.Label('Shot code:', className='my-1'),
                        dbc.Input(id='modal-input-shot-code', type='text',
                                size='sm', style={'width': '130px'}, className='mx-1'),
                    ]),
                ]),
                dbc.ModalFooter([
                    dbc.Label('', id='modal-save-shot-status'),
                    dbc.Button("Save", id="modal-btn-save-shot", className="ms-auto"),
                ]),
            ],
            id="modal-shot",
            is_open=True,
            backdrop='static',
            centered=True,
        )
    return []


@app.callback(
    Output('output', 'children'),
    Input('component', 'xy'),
)
def get_xy(xy):
    if xy:
        return f'x: {xy["x"]}, y: {xy["y"]}'
    return 'x: , y: '


@app.callback(
    Output('component', 'getXY'),
    Input('get-xy-button', 'n_clicks')
)
def trigger_get_xy(n_clicks):
    if n_clicks:
        return True
    return False


if __name__ == '__main__':
    app.run_server(debug=True)
