/**
 *  @file       WaveformViewerPanel.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This is the smaller waveform panel, which will be at the top underneath the 
 *  options bar on the "organization" page.
 *	@class
 **/
function WaveformViewerPanel(params) {
    if(params) {
        this.init(params);
    }
}
WaveformViewerPanel.prototype = new Panel();

WaveformViewerPanel.prototype.init = function(params) {
    Panel.prototype.init.call(this, params);

    
}