import React from 'react';
import './TrackList.css';
import {Track} from '../Track/Track'

export class TrackList extends React.Component{
    render(){
        return(
            <div className="TrackList">
                {
                this.props.tracks.map((song)=><Track 
                onAdd={this.props.onAdd} 
                track={song} key={song.id}
                onRemove={this.props.onRemove}
                isRemoval={this.props.isRemoval}/>)       
                }

</div>
        )
    }
}
export default TrackList;