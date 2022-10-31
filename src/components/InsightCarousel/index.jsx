import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import ServiceCard from '../ServiceCard';
import './index.css'

const InsightCarousel = () => {
    const [data,setData]=useState([]);
    const [dataTwo,setDataTwo]=useState([]);
    useEffect(()=>{
        var url = process.env.REACT_APP_QUERY_URL;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        
        xhr.setRequestHeader("Content-Type", "application/json");
        
        xhr.onreadystatechange = function () {
           if (xhr.readyState === 4) {
              const resJSON=JSON.parse(xhr.response);
              setData(resJSON.hits.hits);
              console.log(resJSON.hits.hits)
           }};
        
        var dataOne = '{"query":{"term":{"product.keyword":{"value":"Red Hat Satellite"}}}}';
        var dataTwo= '{"query":{"term":{"product.keyword":{"value":"Insights Engine"}}}}';
        xhr.send(dataOne);
        var xhrTwo= new XMLHttpRequest();
        xhrTwo.open("POST", url);
        xhrTwo.setRequestHeader("Content-Type", "application/json");
        
        xhrTwo.onreadystatechange = function () {
           if (xhrTwo.readyState === 4) {
              const resJSON=JSON.parse(xhrTwo.response);
              setDataTwo(resJSON.hits.hits);
              console.log(resJSON.hits.hits)
           }};
        xhrTwo.send(dataTwo);
    },[])
  return (
    <div className='insight-carousel'>
        <div className='product-title'>Red Hat Satellite</div>
        <div className='insight-carousel-container'>
            {
                data?.map(dataPoint=>{
                    return <ServiceCard cardContent={dataPoint}></ServiceCard>
                })
            }            
        </div>
        <div className='product-title'>Insights Engine</div>
        <div className='insight-carousel-container'>
            {
                dataTwo?.map(dataPoint=>{
                    return <ServiceCard cardContent={dataPoint}></ServiceCard>
                })
            }            
        </div>
    </div>  
    
    )

}

export default InsightCarousel