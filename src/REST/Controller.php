<?php

namespace WPReliableMD\REST;

class Controller {

	protected $config_filename;

	public function __construct() {

		$this->config_filename = WPReliableMD_PATH.'/config.json';
		add_action( 'rest_api_init', array($this,'WPReliableMD_Api_Init'));
	}

	public function WPReliableMD_Api_Init() {
		register_rest_route(WPReliableMD_NAME, 'config', [
			'methods'   => 'GET',
			'callback'  => array($this,'WPReliableMD_Config_Api')
		]);
		add_filter( 'rest_prepare_post', array($this,'WPReliableMD_REST_Posts'), 10, 3 );
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

	public function WPReliableMD_REST_Posts($response, $post, $request  ) {
		$data = $response->data;
		$postid = $post->ID;

		if(true) { //应判断是否是markdown
			$markdown = $post->post_content;
			$data['content']['markdown'] = $markdown;
		}

		$response->data = $data; //根据wordpress插件约定，应该修改第一参数然后返回
		return $data;
	}
}

?>
