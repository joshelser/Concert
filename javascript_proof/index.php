<html>
<head>

<script type="text/javascript" src ="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
<script type="text/javascript" src ="./script/soundmanager.js"></script>
<script>
	var c=0;
	var t;
	var timerIsOn = 0;

	function timedCount(){
		c = c+1;
		var marginLeftValue = c.toString() + "px";
		$("#tapehead").css("margin-left",marginLeftValue);
		t=setTimeout("timedCount()",100);
		
	}

	function doTimer(){
		if(!timerIsOn) {
			timerIsOn = 1;			
			soundManager.play('test');
			timedCount();
		}
	}

	function stopTimer(){
		timerIsOn = 0;	
		soundManager.stop('test');
		clearTimeout(t);
	}
</script> 
</head>

<body>
<div></div>

<div id ="waveform" style = "width:800px;height:200px; border:1px #bbb dashed;">
	<div id = "tapehead"style = "margin-left:0px;width:0px;height:200px; border-left:1px #ff0000 solid;"></div>

</div>
	<form>
		<input type="button" value="Start count!" onClick="doTimer()">
		<input type="button" value="Stop count!" onClick="stopTimer()"> 
	</form>

<div id = "debugContainer"></div>


<script type="text/javascript">soundManagerInit();</script>
</body>
</html>
