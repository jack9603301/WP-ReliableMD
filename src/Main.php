<?php

namespace WPReliableMD;

use WPReliableMD\Admin\Controller as AdminController;
use WPReliableMD\View\Controller as ViewController;
use WPReliableMD\REST\Controller as RestController;
use WPReliableMD\Environment\Controller as EnvironmentController;
use WPReliableMD\Meta\Controller as MetaController;

class Main {

	public function __construct() {

		global $ReliableMDEnvironmentController;
		global $ReliableMDRestController;
		global $ReliableMDViewController;
		global $ReliableMDAdminController;
		global $ReliableMDMetaController;

		add_action('plugins_loaded', array($this,'EnableLanguages'));

		$ReliableMDEnvironmentController = new EnvironmentController(); //初始化插件环境控制器

		$ReliableMDRestController = new RestController();  //初始化REST控制器

		$ReliableMDViewController = new ViewController(); //初始化前端渲染控制器

		$ReliableMDAdminController = new AdminController(); //初始化后台控制器

		$ReliableMDMetaController = new MetaController(); //初始化插件元信息控制器

	}

	public function EnableLanguages() {
		load_plugin_textdomain(WPReliableMD_FILE,false,WPReliableMD_PATH.'/languages/'); // 启用本地化
	}


}

?>
