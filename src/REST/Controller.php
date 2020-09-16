<?php

namespace WPReliableMD\REST;

use WPReliableMD\View\Controller as ViewController;

class Controller {

	protected $config_filename;

	public function __construct() {

		$this->config_filename = WPReliableMD_PATH.'/config.json';
		add_action( 'rest_api_init', array($this,'WPReliableMD_Api_Init'));
	}

	public function WPReliableMD_Api_Init() {
		global $ReliableMDAdminController;
		register_rest_route(WPReliableMD_NAME, 'config', [
			'methods'   => 'GET',
			'callback'  => array($ReliableMDAdminController,'WPReliableMD_Config_Api')
		]);
		register_rest_route(WPReliableMD_NAME, 'config', [
			'methods'   => 'POST',
			'callback'  => array($this,'WPReliableMD_Config_Api_Set')
		]);
		add_filter( 'rest_prepare_post', array($this,'WPReliableMD_REST_Posts'), 10, 3 );

		register_rest_field('post','markdown',array(
			'get_callback' => array($this,'WPReliableMD_REST_Post_markdown_Get'),
			'update_callback' => array($this,'WPReliableMD_REST_Post_markdown_Update')
		));
		
		register_rest_field('post','markdown_fontmatter',array(
			'get_callback' => array($this,'WPReliableMD_REST_Post_markdown_fontmatter_Get'),
			'update_callback' => array($this,'WPReliableMD_REST_Post_markdown_fontmatter_Update')
		));
	}

	public function WPReliableMD_Config_Api_Set($request) {
		if ( file_exists( $this->config_filename ) ) {
			$f = fopen($this->config_filename, "w");
			fwrite($f, json_encode($request->get_json_params()));
			return $request->get_json_params();
		} else {
			return $request->get_json_params();
		}
	}

	public function WPReliableMD_REST_Posts($response, $post, $request  ) {
		$data = $response->data;
		$postid = $post->ID;

		if(get_post_meta($post->ID,'markdown',true) === 'true') {
			//如果是markdown文章，则输出
			$markdown = $post->post_content;
			$data['content']['markdown'] = $markdown;
			//处理markdown的REST输出处理
			$content = $markdown;
			$content = ViewController::WPReliableMD_Content($content);
			$data['content']['rendered'] = $content;

			//读取信头
            $fontmatter = get_post_meta($post->ID,'fontmatter',true);
            if($fontmatter) {
                $data['content']['fontmatter'] = $fontmatter;
            }
			/*
		 	 * filter  : markdown_rest_post_override($data)
		 	 * comment : The REST API interface implements the post type article to retrieve the JSON field when it is fetch.
		 	 * params  :
		 	 *   - $data : JSON before processing.
		 	 */
			$data = apply_filters('markdown_rest_post_override',$data);
		}


		$response->data = $data; //根据wordpress插件约定，应该修改第一参数然后返回
		return $data;
	}

	public function WPReliableMD_REST_Post_markdown_Get($post) {
		$markdown_tag = get_post_meta( $post['id'], 'markdown',true);
		if($markdown_tag === 'true') {
			return true;
		} else {
			return false;
		}
		
	}

	public function WPReliableMD_REST_Post_markdown_Update($data, $post) {
		$postid = $post->ID;
		if($data) {
			update_post_meta($postid, 'markdown', 'true');
		} else {
			update_post_meta($postid, 'markdown', 'false');
		}
		
		return true;
	}
	
	public function WPReliableMD_REST_Post_markdown_fontmatter_Get($post) {
		$markdown_fontmatter = get_post_meta( $post['id'], 'fontmatter',true);
		
		return $markdown_fontmatter;
	}

	public function WPReliableMD_REST_Post_markdown_fontmatter_Update($data, $post) {
		$postid = $post->ID;
		update_post_meta($postid, 'fontmatter', $data);
		
		return true;
	}
}

?>
