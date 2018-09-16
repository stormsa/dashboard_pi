from flask import (
    Flask,
    render_template,
    Response,
    json
)
from yeelight import Bulb
bulb = Bulb("192.168.1.32")
#import bulb YeelightWifiBulbLanCtrl.py

# Create the application instance
app = Flask(__name__, static_folder="dist", template_folder="public")
# Create a URL route in our application for "/"
@app.route('/')
def home():
    """
    This function just responds to the browser ULR
    localhost:5000/

    :return:        the rendered template 'home.html'
    """
    return render_template('index.html')

# Create a URL route in our application for "/"
@app.route('/getState')
def getState():
	state = bulb.get_properties()
	return Response(json.dumps(state), status=200, mimetype='application/json')

@app.route('/turnOn')
def turnOn():
    bulb.turn_on()
    return Response("{'power':'on'}", status=200, mimetype='application/json')

@app.route('/turnOff')
def turnOff():
    bulb.turn_off()
    return Response("{'power':'off'}", status=200, mimetype='application/json')

@app.route('/toggle')
def toggle():
    bulb.toggle()
    state = bulb.get_properties()
    return Response(json.dumps(state), status=200, mimetype='application/json')

# If we're running in stand alone mode, run the application
if __name__ == '__main__':
    app.run(debug=True)