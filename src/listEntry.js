import React from 'react';
import {Image, ListGroupItem } from "react-bootstrap/";

// User song list entry
const ListEntry = ({ video, listClickHandler }) => {
  return (
    <ListGroupItem action style={{padding: "5%"}}>
      <div onClick={() => listClickHandler(video) }>
        <div style={{ padding: "2%", backgroundColor: "#ECEBEB", borderStyle: "groove"}} >
          <Image src={video.snippet.thumbnails.default.url} roundedCircle></Image>
          <div style={{ class: "column", display: "table"}}>
            <div style={{ fontSize: "1.4em", fontFamily: "Lucida Bright", fontWeight: "bolder", strokeWidth: ""}}>{video.snippet.title}</div>
            <div style={{ color:"#1B4CAF ", fontSize: "1.2em", fontFamily: "Avanta Garde", fontWeight: "bolder", strokeWidth: "13", fontColor: "blue"}}>{video.snippet.channelTitle}</div>
          </div>
        </div>
      </div>
    </ListGroupItem>
  );
};

export default ListEntry;
