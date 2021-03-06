import { expect } from 'chai'
import * as sinon from 'sinon'

import { Messaging, Message, ConnectionRefusedException } from '@internal/messaging'
import { Messaging as ExtensionsMessaging } from '@internal/messaging/extensions/Messaging'

export default ({ browser }) => {
  let messaging: Messaging

  beforeEach(() => {
    messaging = new ExtensionsMessaging
  })

  it('boots up a message listener', () => {
    messaging.listen()

    sinon.assert.calledOnce(browser.runtime.onConnect.addListener)
  })

  it('sends a message via runtime port', async () => {
    browser.runtime.connect.returns({
      postMessage: (message) => {
        expect(message).to.deep.equal({
          event: 'TestMessage',
          payload: 'test'
        })

        return message
      },
      onMessage: { addListener: l => l({ ok: true, body: 'resolved' }) },
      onDisconnect: { addListener: l => undefined }
    })

    await expect(messaging.send(new TestMessage('test')))
      .to.eventually.equal('resolved')

    sinon.assert.calledOnce(browser.runtime.connect)
  })

  it('rejects the promise when error returned', async () => {
    browser.runtime.connect.returns({
      postMessage: m => m,
      onMessage: { addListener: l => l({ ok: false, body: 'error' }) },
      onDisconnect: { addListener: l => undefined }
    })

    await expect(messaging.send(new TestMessage('test')))
      .to.eventually.be.rejected
      .and.to.equal('error')

    sinon.assert.calledOnce(browser.runtime.connect)
  })

  it('rejects if connection could not be established', async () => {
    browser.runtime.lastError = true
    browser.runtime.connect.returns({
      postMessage: (message) => {
        expect(message).to.deep.equal({
          event: 'TestMessage',
          payload: 'test'
        })

        return message
      },
      onMessage: { addListener: l => undefined },
      onDisconnect: { addListener: l => l() }
    })

    await expect(messaging.send(new TestMessage('test')))
      .to.eventually.be.rejectedWith(ConnectionRefusedException)

    sinon.assert.calledOnce(browser.runtime.connect)
  })
}

class TestMessage extends Message {
  //
}
