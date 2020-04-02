<?php

namespace WPReliableMD\Environment;

class Controller {

	public function __construct() {
		add_action( 'init', array( $this, 'WPReliableMD_Register_Script' ) );
		add_action( 'init', array( $this, 'WPReliableMD_Register_Style' ) );
	}

	public function WPReliableMD_Register_Script() {

		//global $ReliableMDAdminController;
		//定义脚本本地化数据
		/*$ReliableMDSetting = array(
			'api_root'        => esc_url_raw( rest_url() ),
			'nonce'           => wp_create_nonce( 'wp_rest' ),
			'js_root'         => WPReliableMD_URL . '/js/',
			//'js_dep_lib_root' => 'https://cdn.jsdelivr.net/npm/',
			'js_dep_lib_root' => WPReliableMD_URL. '/node_modules/',
			'config' => $ReliableMDAdminController->WPReliableMD_Config_Api()
		);*/

//		wp_deregister_script( 'jquery' );

		wp_register_script( 'post', ABSPATH . '/wp-admin/js/post.js', array( ), WPReliableMD_VER, false );
		wp_register_script( 'postbox', ABSPATH . '/wp-admin/js/postbox.js', array( ), WPReliableMD_VER, false );
		wp_register_script( 'require', WPReliableMD_URL . '/js/require.js', array(), WPReliableMD_VER, false );
		wp_register_script( 'require-paths', WPReliableMD_URL . '/js/require_paths.js', array( 'require' ), WPReliableMD_VER, false );
		wp_register_script( 'DateExt', WPReliableMD_URL . '/js/DateExt.js', array( 'require-paths' ), WPReliableMD_VER, false );
		wp_register_script( 'CallBackManager', WPReliableMD_URL . '/js/CallBackManager.js', array( 'DateExt' ), WPReliableMD_VER, false );
		wp_register_script( 'ReliableMD', WPReliableMD_URL . '/js/WPReliableMD_Admin.js', array( 'CallBackManager' ), WPReliableMD_VER, false );
		wp_register_script( 'WPReliableMDFrontend', WPReliableMD_URL . '/js/WPReliableMDFrontend.js', array( 'require-paths' ), WPReliableMD_VER, false );
		//wp_localize_script( 'ReliableMD', 'ReliableMD', $ReliableMDSetting );
		//wp_localize_script( 'require-paths', 'ReliableMD', $ReliableMDSetting );

	}

	public function WPReliableMD_Register_Style() {

		$js_dep_lib_root = 'https://cdn.jsdelivr.net/npm/';
		wp_register_style( 'dashicons-css', ABSPATH . '/wp-includes/css/dashicons.min.css', array(), WPReliableMD_VER, false );
		wp_register_style( 'normalize', WPReliableMD_URL . '/css/normalize.css', array(), WPReliableMD_VER, false );
		wp_register_style( 'codemirror', $js_dep_lib_root.'/codemirror/lib/codemirror.css', array( 'normalize' ), WPReliableMD_VER, false );
		wp_register_style( 'github', $js_dep_lib_root.'/highlightjs/styles/github.css', array( 'codemirror' ), WPReliableMD_VER, false );
		//wp_register_style( 'tui-editor', WPReliableMD_URL . '/css/tui-editor/tui-editor.css', array( 'github' ), WPReliableMD_VER, false );
		wp_register_style( 'tui-editor', $js_dep_lib_root . '@toast-ui/editor/dist/toastui-editor.css', array( 'github' ), WPReliableMD_VER, false );
		wp_register_style( 'tui-editor-contents', WPReliableMD_URL . '/css/tui-editor/tui-editor-contents.css', array( 'tui-editor' ), WPReliableMD_VER, false );
		wp_register_style( 'tui-color-picker', WPReliableMD_URL . '/css/tui-color-picker/tui-color-picker.css', array( 'tui-editor-contents' ), WPReliableMD_VER, false );
		wp_register_style( 'tui-chart', WPReliableMD_URL . '/css/tui-chart/tui-chart.css', array( 'tui-color-picker' ), WPReliableMD_VER, false );
		wp_register_style( 'katex', $js_dep_lib_root.'/katex/dist/katex.css', array( 'tui-editor' ), WPReliableMD_VER, false );
		wp_register_style( 'ReliableMD', WPReliableMD_URL . '/css/WPReliableMD_Admin.css', array( 'katex' ), WPReliableMD_VER, false );
		wp_register_style( 'WPReliableMDFrontend', WPReliableMD_URL . '/css/WPReliableMDFrontend.css', array( 'katex' ), WPReliableMD_VER, false );
	}
}

?>
