from flask import Flask, jsonify, render_template


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/offline")
def offline():
    return render_template("offline.html")


@app.route("/api/ping")
def ping():
    return jsonify(
        {
            "ok": True,
            "message": "PWA + Flask OK",
            "source": "Flask API",
        }
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9001, debug=True)
