<?php

namespace WPReliableMD;

use WPReliableMD\Admin\Controller as AdminController;
use WPReliableMD\View\Controller as ViewController;
use WPReliableMD\REST\Controller as RestController;
use WPReliableMD\Environment\Controller as EnvironmentController;
use WPReliableMD\Meta\Controller as MetaController;

class Main {

	public function __construct() {

		add_action('plugins_loaded', array($this,'EnableLanguages'));

		new EnvironmentController(); //初始化插件环境控制器

		new RestController();  //初始化REST控制器

		new ViewController(); //初始化前端渲染控制器

		new AdminController(); //初始化后台控制器

		new MetaController(); //初始化插件元信息控制器

	}

	function EnableLanguages() {
		load_plugin_textdomain(WPReliableMD_FILE,false,WPReliableMD_PATH.'/languages/'); // 启用本地化
	}


}

?>
