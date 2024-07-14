import base64
import io
import dash_dragrect_figure
import dash
from dash import html, Output, Input, ctx
import dash_bootstrap_components as dbc
from PIL import Image

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])

app.layout = dbc.Container(children=[
    dbc.Card([
        dbc.CardBody(children=[
            dash_dragrect_figure.DragRectFigure(
                id='component',
                xy={'x': 200, 'y': 200},
                style={'width': '100%', 'aspectRatio': '4208/3120'},
            ),
            html.Div(id='modal-container')
    ]),
    dbc.CardFooter(children=[
        html.Div(id='output'),
        dbc.Button('Add', id='btn-add', color='primary', className='me-2'),
        dbc.Button('Edit', id='btn-edit', color='primary'),
        dbc.Button('Add Rect', id='btn-add-rect', color='primary', className='ms-2'),
        dbc.Button('Get XY', id='get-xy-button', color='primary'),
    ])
])])


@app.callback(
    Output('component', 'image', allow_duplicate=True),
    Output('component', 'isWithRect'),
    Input('btn-add', 'n_clicks'),
    Input('btn-add-rect', 'n_clicks'),
    prevent_initial_call=True,
)
def update_image_display(n_clicks, n_clicks_rect):
    image_filename = r'C:\dash_dragrect_figure\20230926-085311_8I  008884_AM-FC-01.jpg'
    ctx = dash.callback_context
    if ctx.triggered_id == 'btn-add':
        if n_clicks%2 == 1:
            # Read the image file into memory
            with open(image_filename, 'rb') as image_file:
                image_data = image_file.read()
            
            # Open the image from memory
            img = Image.open(io.BytesIO(image_data))
            
            # Get the image size
            width, height = img.size
            
            # Encode the image to base64
            encoded_image = base64.b64encode(image_data).decode('ascii')
            image_data = f'data:image/jpg;base64,{encoded_image}'
            
            # Return the image data along with its size
            return {'imageData': image_data, 'width': width, 'height': height}, dash.no_update
        elif n_clicks%2 == 0:
            return None, False
    elif ctx.triggered_id == 'btn-add-rect':
        if n_clicks_rect%2 == 1:
            return dash.no_update, True
        elif n_clicks_rect%2 == 0:
            return dash.no_update, False
    return dash.no_update, dash.no_update


# @app.callback(
#     Output('modal-container', 'children'),
#     Input('btn-add', 'n_clicks'),
#     Input('btn-edit', 'n_clicks'),
#     prevent_initial_call=True,
# )
# def on_btn_shot_click(add_clicks, edit_clicks):
#     triggered_id = ctx.triggered_id
#     if triggered_id == 'btn-add':
#         return dbc.Modal(
#             [
#                 dbc.ModalHeader(
#                     dbc.ModalTitle('Add', id='modal-shot-title')
#                 ),
#                 dbc.ModalBody([
#                     html.Div(className='mb-3 d-flex', children=[
#                         dbc.Label('Shot code:', className='my-1'),
#                         dbc.Input(id='modal-input-shot-code', type='text',
#                                 size='sm', style={'width': '130px'}, className='mx-1'),
#                     ]),
#                 ]),
#                 dbc.ModalFooter([
#                     dbc.Label('', id='modal-save-shot-status'),
#                     dbc.Button("Save", id="modal-btn-save-shot", className="ms-auto"),
#                 ]),
#             ],
#             id="modal-shot",
#             is_open=True,
#             backdrop='static',
#             centered=True
#         )
#     elif triggered_id == 'btn-edit':
#         return dbc.Modal(
#             [
#                 dbc.ModalHeader(
#                     dbc.ModalTitle('Edit', id='modal-shot-title')
#                 ),
#                 dbc.ModalBody([
#                     html.Div(className='mb-3 d-flex', children=[
#                         dbc.Label('Shot code:', className='my-1'),
#                         dbc.Input(id='modal-input-shot-code', type='text',
#                                 size='sm', style={'width': '130px'}, className='mx-1'),
#                     ]),
#                 ]),
#                 dbc.ModalFooter([
#                     dbc.Label('', id='modal-save-shot-status'),
#                     dbc.Button("Save", id="modal-btn-save-shot", className="ms-auto"),
#                 ]),
#             ],
#             id="modal-shot",
#             is_open=True,
#             backdrop='static',
#             centered=True,
#         )
#     return []


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
