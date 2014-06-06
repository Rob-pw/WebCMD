<?php

$ip = !empty($_SERVER['REMOTE_ADDR'])?$_SERVER['REMOTE_ADDR']:'';
$json = array();
$json['ip'] = $ip;

if(!empty($_GET['callback'])){
	//remove non standard characters if callback is set
	$callback = preg_replace('#[^a-zA-Z0-9\-\_]#','',$_GET['callback']);
}

if(!empty($callback)){
	//if callback still exists after cleaning up non standard characters
	//then call that function with the IP data
	echo $callback.'('.json_encode($json).');';	
}else{
	//else echo the IP data
	echo json_encode($json);
}

?>