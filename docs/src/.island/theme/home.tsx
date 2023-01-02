
import './home.scss'
import './animation-bg.scss'

export function HomeLayout (){
  
  return (
  <div className='home'>
    <img src='/logo.png' />
    <h1 className="proj-title">ui-playground</h1>
    <p className="proj-descr">面向组件库开发者的 playground 组件</p>
    <div className="intor-container">
      <button className="intor-items start">
        <a href='/zh/guide/getting-started'>🚀 快速开始</a>
        </button>
      <button className="intor-items install">
        <a href='/zh/guide/install'>✨ 安装使用</a>
      </button>
    </div>

    <div className="wrap">
      <div className="shadowLeft"></div>
      <div className="shadowRight"></div>
      <div className="shadowBottom"></div>
    </div>
    
  </div>
  );
}
