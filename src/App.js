import React, { Component } from 'react';
import './App.css';
import Petal from './petal';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cw: "0",
      ch: "0",
      n: 60,
      imgnames: [
        "petal1",
        "petal2",
        "petal3",
        "petal4",
        "petal5",
        "petal6",
        "petal7",
        "petal8"
      ]
    }

    this.setCanvas = this.setCanvas.bind(this);
    this.createPetal = this.createPetal.bind(this);
    this.imgLoad = this.imgLoad.bind(this);
    this.allImgLoad = this.allImgLoad.bind(this);
    this.go = this.go.bind(this);
  }

  setCanvas() {
    let W = document.documentElement.clientWidth;
    let H = document.documentElement.clientHeight;
    this.setState({
      cw: W,
      ch: H
    });
  }

  imgLoad(imgname) {
    return new Promise((resolve, reject) => {
      try {
        let img = new Image();
        img.src = require(`./images/${imgname}.png`);
        img.onload = () => {
          resolve(img);
        }
      } catch(e) {
        reject(e)
      }
    });
  }

  allImgLoad(imgnames) {
    let p = [];
    for (let i = 0; i < imgnames.length; i++) {
      p.push(this.imgLoad(imgnames[i]));
    }
    return Promise.all(p).then(res => {
      return res;
    }).catch((e) => {
      console.log(e);
    });
  }

  async go(ctx, petal, img, index) {
    let _this = this;
    let w = this.state.cw;
    let h = this.state.ch;
    petal.canvasW = this.state.cw;
    petal.canvasH = this.state.ch;
    if (index === 0) {
      ctx.clearRect(0, 0, w, h);
    }

    await petal.move();
    petal.draw(ctx, img);
    window.requestAnimationFrame(() => {
      _this.go(ctx, petal, img, index);
    });
  }

  async createPetal() {
    let canvas = this.refs["page_bg"];
    let ctx = canvas.getContext("2d");
    let imgnames = [];
    let totalNum = this.state.imgnames.length;
    for (let i = 0; i < this.state.n; i++) {
      imgnames.push(this.state.imgnames[i % totalNum]);
    }
    let imgs = await this.allImgLoad(imgnames);
    if (!imgs) return;
    for (let i = 0; i < imgs.length; i++) {
      let petal = new Petal(canvas.width, canvas.height);
      this.go(ctx, petal, imgs[i], i);
    }
  }

  componentDidMount() {
    this.setCanvas();
    window.onresize = () => {
      this.setCanvas();
    }

    this.createPetal();
  }

  render() {
    return (
      <div className="App">
        <canvas id="canvas" ref="page_bg" width={this.state.cw} height={this.state.ch}></canvas>
      </div>
    );
  }
}

export default App;
