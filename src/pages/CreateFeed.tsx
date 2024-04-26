import React, { useState } from "react"
import Sheet from 'react-modal-sheet';
import { FeedService } from "../services/FeedService.ts";

const CreateFeed = () => {
    const [isOpen, setOpen] = useState(false);
    const [feedName, setFeedName] = useState('');
    
    const onSaveNew = async (event: any) => {
        try {
          const newFeed: any = await (await FeedService.createFeed(feedName)).json();
          console.log(newFeed)
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
        <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
          <Sheet.Container className="sheet">
            <Sheet.Header />
            <Sheet.Content>
              <div className="create-feed">
                <input className="input is-medium is-rounded" type="text" value={feedName} name="feedName" onChange={onChangeFeedName} placeholder="Feed name" />
                <div className="create-feed__options">
                  <button className="button is-success is-medium" onClick={onSaveNew}>Ok</button>
                  <button className="button is-medium is-outlined" onClick={onCancelCreate}>Cancel</button>
                </div>
              </div>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop />
        </Sheet>
      </main>
    )
}

export default CreateFeed