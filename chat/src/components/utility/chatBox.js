import React from 'react'
import { Modal } from 'react-bootstrap'

export default function ChatBox({show, setShow, user, send, msgLists}) {
    console.log("LIST", msgLists);
  return (
    <>
      <Modal
        size="lg"
        show={show}
        onHide={() => setShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
                Chat With {user?.user}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="d-flex flex-column">
                {
                    msgLists?.map((msg, idx) => (
                        <p key={idx}>{msg}</p>
                    ))
                }
            </div>
            <hr/>
            <form onSubmit={send}>
                <div className="mb-3 row">
                    <div className="col-sm-10">
                    <input type="text" className="form-control" id="inputPassword" name='msg'/>
                    </div>
                </div>
                <div className="col-auto">
                    <button type="submit" className="btn btn-primary mb-3">Send</button>
                </div>
            </form>
        </Modal.Body>
      </Modal>
    </>
  )
}
