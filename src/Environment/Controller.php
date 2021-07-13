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
		wp_register_script( 'latexjs', WPReliableMD_URL .'/node_modules/latex.js/dist/latex.js', array(), WPReliableMD_VER, false );
		wp_register_script( 'tui-editor', '//uicdn.toast.com/editor/latest/toastui-editor-all.min.js', array(), WPReliableMD_VER, false );
		wp_register_script( 'tui-chart', '//uicdn.toast.com/chart/v4.1.4/toastui-chart.min.js', array(), WPReliableMD_VER, false );
		wp_register_script( 'tui-chart-plugin', '//uicdn.toast.com/editor-plugin-chart/latest/toastui-editor-plugin-chart.min.js', array('tui-chart'), WPReliableMD_VER, false );
		wp_register_script( 'tui-code-syntax-highlight', '//uicdn.toast.com/editor-plugin-code-syntax-highlight/latest/toastui-editor-plugin-code-syntax-highlight-all.min.js', array(), WPReliableMD_VER, false );
		wp_register_script( 'tui-color-picker', '//uicdn.toast.com/tui-color-picker/v2.2.6/tui-color-picker.min.js', array(), WPReliableMD_VER, false );
		wp_register_script( 'tui-color-syntax', '//uicdn.toast.com/editor-plugin-color-syntax/latest/toastui-editor-plugin-color-syntax.min.js', array('tui-color-picker'), WPReliableMD_VER, false );
		wp_register_script( 'tui-table-merged-cell', '//uicdn.toast.com/editor-plugin-table-merged-cell/latest/toastui-editor-plugin-table-merged-cell.min.js', array(), WPReliableMD_VER, false );
		wp_register_script( 'tui-uml', '//uicdn.toast.com/editor-plugin-uml/latest/toastui-editor-plugin-uml.min.js', array(), WPReliableMD_VER, false );
		wp_register_script( 'require-paths', WPReliableMD_URL . '/js/require_paths.js', array( 'require' ), WPReliableMD_VER, false );
		wp_register_script( 'DateExt', WPReliableMD_URL . '/js/DateExt.js', array( 'require-paths' ), WPReliableMD_VER, false );
		wp_register_script( 'CallBackManager', WPReliableMD_URL . '/js/CallBackManager.js', array( 'DateExt' ), WPReliableMD_VER, false );
		wp_register_script( 'WPReliableMD', WPReliableMD_URL . '/js/WPReliableMD_Admin.js', array( 'CallBackManager' ), WPReliableMD_VER, false );
		wp_register_script( 'WPReliableMDFrontend', WPReliableMD_URL . '/js/WPReliableMDFrontend.js', array( 'require-paths' ), WPReliableMD_VER, false );
		//wp_localize_script( 'ReliableMD', 'ReliableMD', $ReliableMDSetting );
		//wp_localize_script( 'require-paths', 'ReliableMD', $ReliableMDSetting );

		wp_register_script( 'tags-box', ABSPATH . '/wp-admin/js/tags-box.min.js', array(),false, false );

	}

	public function WPReliableMD_Register_Style() {

		//$js_dep_lib_root = 'https://cdn.jsdelivr.net/npm/';
		$js_dep_lib_root = WPReliableMD_URL. '/node_modules/';
		wp_register_style( 'dashicons-css', ABSPATH . '/wp-includes/css/dashicons.min.css', array(), WPReliableMD_VER, false );
		wp_register_style( 'normalize', WPReliableMD_URL . '/css/normalize.css', array(), WPReliableMD_VER, false );
		wp_register_style( 'codemirror', $js_dep_lib_root.'codemirror/lib/codemirror.css', array( 'normalize' ), WPReliableMD_VER, false );
		wp_register_style( 'github', $js_dep_lib_root.'highlight.js/styles/github.css', array( 'codemirror' ), WPReliableMD_VER, false );
		//wp_register_style( 'tui-editor', WPReliableMD_URL . '/css/tui-editor/tui-editor.css', array( 'github' ), WPReliableMD_VER, false );
		wp_register_style( 'latexjs-base', WPReliableMD_URL .'/node_modules/latex.js/dist/css/base.css', array( 'github' ), WPReliableMD_VER, false );
		wp_register_style( 'latexjs-article', WPReliableMD_URL .'/node_modules/latex.js/dist/css/article.css', array( 'github' ), WPReliableMD_VER, false );
		wp_register_style( 'latexjs-book', WPReliableMD_URL .'/node_modules/latex.js/dist/css/book.css', array( 'github' ), WPReliableMD_VER, false );
		wp_register_style( 'latexjs-katex', WPReliableMD_URL .'/node_modules/latex.js/dist/css/katex.css', array( 'github' ), WPReliableMD_VER, false );
		wp_register_style( 'tui-editor', '//uicdn.toast.com/editor/latest/toastui-editor.min.css', array( 'github' ), WPReliableMD_VER, false );
		wp_register_style( 'tui-chart', '//uicdn.toast.com/chart/latest/toastui-chart.min.css', array( ), WPReliableMD_VER, false );
		wp_register_style( 'tui-prism', '//cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/themes/prism.min.css', array( ), WPReliableMD_VER, false );
		wp_register_style( 'tui-code-syntax-highlight', '//uicdn.toast.com/editor-plugin-code-syntax-highlight/latest/toastui-editor-plugin-code-syntax-highlight.min.css', array( 'tui-prism' ), WPReliableMD_VER, false );
		wp_register_style( 'tui-color-picker', '//uicdn.toast.com/tui-color-picker/latest/tui-color-picker.min.css', array( ), WPReliableMD_VER, false );
		wp_register_style( 'tui-color-syntax', '//uicdn.toast.com/editor-plugin-color-syntax/latest/toastui-editor-plugin-color-syntax.min.css', array( 'tui-color-picker' ), WPReliableMD_VER, false );
		wp_register_style( 'tui-table-merged-cell', '//uicdn.toast.com/editor-plugin-table-merged-cell/latest/toastui-editor-plugin-table-merged-cell.min.css', array( ), WPReliableMD_VER, false );
		wp_register_style( 'WPReliableMD', WPReliableMD_URL . '/css/WPReliableMD_Admin.css', array( ), WPReliableMD_VER, false );
		wp_register_style( 'WPReliableMDFrontend', WPReliableMD_URL . '/css/WPReliableMDFrontend.css', array( ), WPReliableMD_VER, false );
	}
}

?>
