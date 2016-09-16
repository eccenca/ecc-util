/* global describe, it, before, global */
// imports
import should from 'should';
import sinon from 'sinon';

import {changeFavicon} from '../index';

// main test suite
describe('changeFavicon', () => {

    beforeEach(() => {
        global.document = {
            createElement: sinon.stub().returns({}),
            getElementById: sinon.stub(),
            getElementsByTagName: sinon.stub(),
            head: {
                appendChild: sinon.stub(),
                removeChild: sinon.stub(),
            }
        }
    });

    afterEach(() => {
       delete global.document;
    });

    it('should exist', () => {
        // check object
        should.exist(changeFavicon);
    });

    it('should append an favicon to the document head', () => {
        document.getElementById.returns(null);
        changeFavicon('foo');
        sinon.assert.calledOnce(document.createElement);
        sinon.assert.calledOnce(document.getElementById);
        sinon.assert.notCalled(document.head.removeChild);
        sinon.assert.calledOnce(document.head.appendChild);
    });

    it('should remove an old favicon from the document head if existing and add a new one', () => {
        document.getElementById.returns(true);
        changeFavicon('foo');
        sinon.assert.calledOnce(document.createElement);
        sinon.assert.calledOnce(document.getElementById);
        sinon.assert.calledOnce(document.head.removeChild);
        sinon.assert.calledOnce(document.head.appendChild);
    });

    it('should use fallback api if document.head is not defined', () => {
        const head = document.head;
        delete document.head;
        document.getElementsByTagName.returns([head]);
        changeFavicon('foo');
        sinon.assert.calledOnce(document.getElementsByTagName);
        sinon.assert.calledOnce(document.createElement);
        sinon.assert.calledOnce(document.getElementById);
        sinon.assert.notCalled(head.removeChild);
        sinon.assert.calledOnce(head.appendChild);
    });

});

