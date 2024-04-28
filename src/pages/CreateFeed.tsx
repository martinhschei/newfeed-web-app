import React, { useState } from "react";
import Sheet from 'react-modal-sheet';
import { useNavigate } from "react-router-dom";
import { FeedService } from "../services/FeedService.ts";

const CreateFeed = () => {
    const navigate = useNavigate();
    const [isOpen, setOpen] = useState(false);
    const [feedName, setFeedName] = useState('');
    
    const onSaveNew = async (event: any) => {
      try {
        const newFeed: any = await (await FeedService.createFeed(feedName)).json();
        console.log(newFeed)
        setOpen(false);
        navigate('/' + newFeed.data.slug);
      } catch (error) {
        console.error("Could not create feed: ", error);
      }
    }
    
    const onChangeFeedName = (event: any) => {
      console.log(event.target.value);
      setFeedName(event.target.value);
    }
  
    const onCreateNew = (event: any) => {
      setOpen(true);
    }
  
    const onCancelCreate = (event: any) => {
      setOpen(false);
    }

    return (
      <main className="landing">
        <button className="button is-success is-medium" onClick={onCreateNew}>New feed</button>
        <div className="sheet-wrapper">
          <Sheet isOpen={isOpen} onClose={() => setOpen(false)} snapPoints={[-50, 0.5, 100, 0]} initialSnap={1} >
            <Sheet.Container className="sheet">
              <Sheet.Header />
              <Sheet.Content>
                <div className="create-feed-wrapper" style={{display: 'flex', 'justifyContent' : 'center'}}>
                  <div className="create-feed" style={{minWidth: '350px', maxWidth: '650px'}}>
                    <input className="input is-medium is-rounded" type="text" value={feedName} name="feedName" onChange={onChangeFeedName} placeholder="Feed name" />
                    <div className="create-feed__options">
                      <button className="button is-success is-medium" onClick={onSaveNew}>Start</button>
                      <button className="button is-medium" onClick={onCancelCreate}>Cancel</button>
                    </div>
                  </div>
                </div>
              </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop />
          </Sheet>
        </div>
      </main>
    )
}

export default CreateFeed