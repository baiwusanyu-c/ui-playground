
import './home.scss'
import LeftBg from '../../public/left-bg.svg'
import RightBg from  '../../public/right-bg.svg'
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
    <div className='bgs'> 
    <LeftBg style={{
      position: 'absolute',
      left: '0px',
      bottom: '60px',
      width:  '25%',
      height:  '25%', 
    }}/>

    <RightBg style={{
      position: 'absolute', 
      right: '0px',
      top: '100px',
      width: '25%',
      height:  '25%',
    }}/>
    </div>
    
  </div>
  );
}
