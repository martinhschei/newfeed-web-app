import Sheet from 'react-modal-sheet';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FeedService } from "../services/FeedService.ts";
import UserService from '../services/UserService.ts';

const CreateFeed = ({user}: {user: any}) => {
    const navigate = useNavigate();
    const [createFeedOpen, setCreateFeedOpen] = useState(false);
    const [feedName, setFeedName] = useState('');
    const [userName, setUserName] = useState('');
    const [createUserIsOpen, setCreateUserIsOpen] = useState(false);
    const [createdUser, setCreatedUser] = useState({id: ''} as any)
    
    const onSaveNew = async (event: any) => {
      try {
        const userId = user ? user.id : createdUser.id
        if (!userId) {
            throw Error("No user id found")
        }

        const newFeed: any = await (await FeedService.createFeed(feedName, userId)).json();
        console.log(newFeed)
        setCreateFeedOpen(false);
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
      if (!user && !createdUser.id  ) {
        setCreateUserIsOpen(true)
        return
      }

      setCreateFeedOpen(true);
    }
  
    const onCancelCreate = (event: any) => {
      setCreateFeedOpen(false);
    }

    const onChangeUserName = (event: any) => {
      setUserName(event.target.value);
    }

    const cancelCreateUser = async () => {
      setCreateUserIsOpen(false)
      setUserName('')
  }
  
  const onCreateUser = async () => {
      await UserService.createUser(userName)
          .then((response) => {
              setCreateUserIsOpen(false)
              setCreateFeedOpen(true)
              localStorage.setItem('user', JSON.stringify(response))
              setCreatedUser(response)
          });
  }

    return (
      <main className="landing">
        <button className="button is-success is-medium" onClick={onCreateNew}>New feed</button>
        <div className="sheet-wrapper">
          <Sheet isOpen={createFeedOpen} onClose={() => setCreateFeedOpen(false)} snapPoints={[-50, 0.5, 100, 0]} initialSnap={1} >
            <Sheet.Container>
              <Sheet.Header />
              <Sheet.Content>
                <div className="sheet-content-wrapper">
                  <div className="sheet-content">
                    <input className="input is-medium is-rounded mb-2" type="text" value={feedName} name="feedName" onChange={onChangeFeedName} placeholder="Feed name" />
                    <div className="sheet-actions">
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

        <div className="sheet-wrapper">
          <Sheet isOpen={createUserIsOpen} onClose={() => setCreateUserIsOpen(false)} snapPoints={[-50, 0.6, 100, 0]} initialSnap={1} >
              <Sheet.Container>
              <Sheet.Header />
                  <Sheet.Content>
                      <div className="sheet-content-wrapper">
                        <p className="sheet-content">
                          For å opprette en feed må du har et brukernavn. Brukernavnet kan være akkurat hva du vil.
                        </p>
                        <div className="sheet-content">
                          <div>
                              <input className="input is-medium is-rounded mb-2" type="text" value={userName} name="userName" onChange={onChangeUserName} placeholder="Brukernavn" />
                          </div>
                          <div className="sheet-actions">
                              <button className="button is-success is-medium" onClick={onCreateUser}>Ok</button>
                              <button className="button is-medium" onClick={cancelCreateUser}>Cancel</button>
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