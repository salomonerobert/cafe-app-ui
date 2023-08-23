import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from './EventCard';

export default function MainComponent() {
  // const [eventArray, setEventArray] = useState([]);
  const [eventMap, setEventMap] = useState(new Map());
  const [loading, setLoading] = useState(true)

  function fetchLatestEvents() {
    setLoading(true)
    axios.get('https://timeline.cyi-e82.workers.dev/')
    .then((res) => {
      if (res.status === 200) {
        // console.log(res.data)
        setEventMap(createSortedEventMap(res.data));
        setLoading(false);
      }
    })

  }

  function createSortedEventMap(eventArray) {
    console.log(eventArray)
    eventArray.sort((a, b) => a.timestamp - b.timestamp);
    let output = new Map();

    let formattedDate = new Date(eventArray[0].timestamp).toLocaleDateString();

    for (let i = 0; i < eventArray.length; i++) {
      let currDate = new Date(eventArray[i].timestamp).toLocaleDateString()
      if (currDate === formattedDate) {
        output.set(formattedDate, (output.get(formattedDate) || []).concat([eventArray[i]]))
      } else {
        formattedDate = currDate;
        output.set(formattedDate, (output.get(formattedDate) || []).concat([eventArray[i]]))
      }
    }

    return output;
  }

  useEffect(() => {
    fetchLatestEvents();
  }, [])
  

  return (
    <div className='container'>
      ({Array.from(eventMap.keys()).map((date, idx) => (
        <>
        <div className='row' key={idx}>{date}</div>
        {eventMap.get(date).map((evt, index) => (
          <div className='row mt-2' key={index}>
            <div className='col-md-4 text-end'>{new Date(evt.timestamp).toLocaleTimeString()}</div>
            <div className='col-md-8'>
              <EventCard title={evt.title} summary={evt.summary} alert={evt.alert} label={evt.label} subtitle={evt.subtitle}/>
            </div>
          </div>
        ))}
        </>
      ))})
    </div>
  )
}


// Create card component
// pass in key props into component
// main page component -> 2 columns & 1 row for each entry -> datetime & card
// logic to group events by date and sort by timeline