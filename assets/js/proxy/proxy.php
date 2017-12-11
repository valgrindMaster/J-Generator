<?php
	/* --- Used to make callouts to Wiki APIs. This is necessary due to cross-domain policies. ---*/
	
	if (array_key_exists('filename', $_REQUEST)) {
		$filename = $_REQUEST['filename'];
	} else {
		echo "<string>Need a <em>filename</em> to fetch!</strong>";
		exit();
	}

	$fileData = file_get_contents($filename);
	header("content-type: text/xml");
	echo $fileData;
?>