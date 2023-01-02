
import './home.scss'
import './animation-bg.scss'
import { usePageData } from 'islandjs/runtime';
import {useEffect, useState} from "react";
export function HomeLayout (){
  const pageData = usePageData()
  const [pageInfo, setPageInfo] = useState({
    descr: '面向组件库开发者的 playground 组件',
    start: '快速开始',
    install: '安装使用',
  })
  useEffect(()=>{
    if(pageData.routePath === '/en'){
      setPageInfo({
        descr: 'Playground components for component library developers',
        start: 'start',
        install: 'install',
      })
    }
  },[pageData.routePath])

  return (
  <div className='home'>
    <img src='/logo.png' />
    <h1 className="proj-title">ui-playground</h1>
    <p className="proj-descr">{pageInfo.descr}</p>
    <div className="intor-container">
      <button className="intor-items start">
        <a href='/zh/guide/getting-started'>🚀 {pageInfo.start}</a>
        </button>
      <button className="intor-items install">
        <a href='/zh/guide/install'>✨ {pageInfo.install}</a>
      </button>
    </div>

    <div className="wrap">
      <div className="shadowLeft"></div>
    {/*  <div className="shadowRight"></div>*/}
      <div className="shadowBottom"></div>
    </div>
    
  </div>
  );
}
