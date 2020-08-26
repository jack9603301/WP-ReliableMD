<?php
use WPReliableMD\Main as Main;
    class WPReliableMDRoot extends WP_UnitTestCase {
        function test_init() {
             define('WPReliableMD_NAME','WP-ReliableMD');
             define('WPReliableMD_VER','1.0');
            define('WPReliableMD_FILE',plugin_basename( __FILE__ ));
            define('WPReliableMD_URL', plugins_url( '', __FILE__ ). "/../../" ); //插件资源路径
            define('WPReliableMD_PATH', dirname( __FILE__ ) . "/../../" ); //插件路径文件夹
            //自动加载
           require_once WPReliableMD_PATH . '/vendor/autoload.php';
           new Main();  //进入插件主处理程序
	      $this->assertTrue(true);
	}
}
?>
