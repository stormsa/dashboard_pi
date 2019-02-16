from flask import (
    Flask,
    render_template,
    Response,
    json
)

from yeelight import (
    discover_bulbs,
    Bulb
)
try:
    bulb_ip = discover_bulbs()[0]['ip']
    bulb = Bulb(bulb_ip)
except Exception as err:
      print("Oops!  We can't find a yeelight bulb ip", err)

# Create the application instance
app = Flask(__name__, static_folder="dist", template_folder="public")


# This function just responds to the browser URL localhost:5000/
# Return the rendered template 'index.html'
@app.route('/')
def home():
    return render_template('index.html')


# Create a URL route in our application for "/"
@app.route('/getState')
def get_state():
    state = bulb.get_properties()
    return Response(json.dumps(state), status=200, mimetype='application/json')


@app.route('/turnOn')
def turn_on():
    bulb.turn_on()
    return Response("{'power':'on'}", status=200, mimetype='application/json')


@app.route('/turnOff')
def turn_off():
    bulb.turn_off()
    return Response("{'power':'off'}", status=200, mimetype='application/json')


@app.route('/bright_up')
def bright_up():
    bright = int(bulb.get_properties()["bright"])
    if bright <= 90:
        bright = bright + 10
        bulb.set_brightness(bright)
    response = {"bright": bright}
    return Response(json.dumps(response), status=200, mimetype='application/json')


@app.route('/bright_down')
def bright_down():
    bright = int(bulb.get_properties()["bright"])
    if bright >= 10:
        bright = bright - 10
        bulb.set_brightness(bright)
    response = {"bright": bright}
    return Response(json.dumps(response), status=200, mimetype='application/json')


@app.route('/toggle')
def toggle():
    bulb.toggle()
    state = bulb.get_properties()
    return Response(json.dumps(state), status=200, mimetype='application/json')


# If we're running in stand alone mode, run the application
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
