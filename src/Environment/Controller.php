<?php

namespace WPReliableMD\Environment;

class Controller {

	protected $config_filename;

	public function __construct() {
		add_action( 'init', array( $this, 'WPReliableMD_Register_Script' ) );
		add_action( 'init', array( $this, 'WPReliableMD_Register_Style' ) );
		$this->config_filename = WPReliableMD_PATH.'/config.json';
	}

	public function WPReliableMD_Register_Script() {
		//定义脚本本地化数据
		$ReliableMDSetting = array(
			'api_root'        => esc_url_raw( rest_url() ),
			'nonce'           => wp_create_nonce( 'wp_rest' ),
			'js_root'         => WPReliableMD_URL . '/js/',
			'js_dep_lib_root' => WPReliableMD_URL . '/bower_components/',
			'config' => $this->WPReliableMD_Config_Api()
		);

//		wp_deregister_script( 'jquery' );

		wp_register_script( 'require', WPReliableMD_URL . '/js/require.js', array(), WPReliableMD_VER, false );
		wp_register_script( 'require-paths', WPReliableMD_URL . '/js/require_paths.js', array( 'require' ), WPReliableMD_VER, false );
		wp_register_script( 'ReliableMD', WPReliableMD_URL . '/js/WPReliableMD_Admin.js', array( 'require-paths' ), WPReliableMD_VER, false );
		wp_register_script( 'WPReliableMDFrontend', WPReliableMD_URL . '/js/WPReliableMDFrontend.js', array( 'require-paths' ), WPReliableMD_VER, false );
		wp_localize_script( 'ReliableMD', 'ReliableMD', $ReliableMDSetting );
		wp_localize_script( 'require-paths', 'ReliableMD', $ReliableMDSetting );

	}

	public function WPReliableMD_Register_Style() {
		wp_register_style( 'normalize', WPReliableMD_URL . '/css/normalize.css', array(), WPReliableMD_VER, false );
		wp_register_style( 'codemirror', WPReliableMD_URL . '/bower_components/codemirror/lib/codemirror.css', array( 'normalize' ), WPReliableMD_VER, false );
		wp_register_style( 'github', WPReliableMD_URL . '/bower_components/highlightjs/styles/github.css', array( 'codemirror' ), WPReliableMD_VER, false );
		wp_register_style( 'tui-editor', WPReliableMD_URL . '/bower_components/tui-editor/dist/tui-editor.css', array( 'github' ), WPReliableMD_VER, false );
		wp_register_style( 'tui-editor-contents', WPReliableMD_URL . '/bower_components/tui-editor/dist/tui-editor-contents.css', array( 'tui-editor' ), WPReliableMD_VER, false );
		wp_register_style( 'tui-color-picker', WPReliableMD_URL . '/bower_components/tui-color-picker/dist/tui-color-picker.css', array( 'tui-editor-contents' ), WPReliableMD_VER, false );
		wp_register_style( 'tui-chart', WPReliableMD_URL . '/bower_components/tui-chart/dist/tui-chart.css', array( 'tui-color-picker' ), WPReliableMD_VER, false );
		wp_register_style( 'katex', WPReliableMD_URL . '/bower_components/katex/dist/katex.css', array( 'tui-editor' ), WPReliableMD_VER, false );
		wp_register_style( 'ReliableMD', WPReliableMD_URL . '/css/WPReliableMD_Admin.css', array( 'katex' ), WPReliableMD_VER, false );
		wp_register_style( 'WPReliableMDFrontend', WPReliableMD_URL . '/css/WPReliableMDFrontend.css', array( 'katex' ), WPReliableMD_VER, false );
	}

	public function WPReliableMD_Config_Api() {
		if ( file_exists( $this->config_filename ) ) {
			$f = fopen($this->config_filename, "r");
			$config = fread($f, filesize($this->config_filename));
			return json_decode($config,TRUE);
		} else {
			return [
				'enable' => true,
				'latex' => "MathJax",
				'info' => 'default config'
			];
		}
	}
}

?>
