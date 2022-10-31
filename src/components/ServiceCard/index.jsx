import React from 'react'
import './index.css'
const ServiceCard = ({cardContent}) => {
  return (
    <div className='service-card' style={{backgroundColor:cardContent._source.result=='FAIL'?'red':'green'}}>
        <div className='card-Title'>
            {cardContent._source.product}
        </div>
        <div className='card-Version'>
        Version : {cardContent._source.version}    
        </div>
        <div className='card-result'>
        Result : {cardContent._source.result}
        </div>        
        </div>
  )
}

export default ServiceCard