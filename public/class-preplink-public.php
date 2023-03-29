<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 * 
 * @link       https://github.com/itsmeit268/preplink
 * @author     itsmeit <itsmeit.biz@gmail.com>
 * Website     https://itsmeit.co | https://itsmeit.biz
 */

class Preplink_Public
{

    /**
     * The ID of this plugin.
     * @access   private
     * @var      string $plugin_name The ID of this plugin.
     */
    private $plugin_name;

    /**
     * The version of this plugin.
     * @access   private
     * @var      string $version The current version of this plugin.
     */
    private $version;

    /**
     * Preplink_Public constructor.
     * @param $plugin_name
     * @param $version
     */
    public function __construct($plugin_name, $version)
    {
        $this->plugin_name = $plugin_name;
        $this->version     = $version;
        add_action('init', array($this, 'preplink_rewrite_endpoint'), 10, 0);
        add_action('wp_head', array($this, 'add_prep_custom_styles'), 10, 2);
    }

    public function enqueue_styles()
    {
        wp_enqueue_style('global' . $this->plugin_name, plugin_dir_url(__FILE__) . 'css/global.css', array(), $this->version, 'all');
    }

    public function enqueue_scripts()
    {
        global $wp_query;
        $settings = get_option('preplink_setting');
        if (!empty($settings['preplink_endpoint']) && !is_front_page()) {
            wp_enqueue_script('global-preplink', plugin_dir_url(__FILE__) . 'js/global.js', array('jquery'), $this->version, false);
            wp_localize_script('global-preplink', 'prep_vars', array(
                'end_point' => $this->getEndPointValue(),
                'prep_url'  => !empty($settings['preplink_url']) ? $settings['preplink_url'] : 'drive.google.com, play.google.com',
                'count_down' => !empty($settings['preplink_countdown']) ? $settings['preplink_countdown'] : 0,
                'display_mode' => !empty($settings['preplink_display_mode']) ? $settings['preplink_display_mode'] : 'wait_time',
                'auto_direct'  => !empty($settings['preplink_auto_direct']) ? $settings['preplink_auto_direct'] : 0,
                'text_complete' => !empty($settings['preplink_text_complete']) ? $settings['preplink_text_complete'] : '[Link ready!]',
            ));

        }

        if (!isset($wp_query->query_vars[$this->getEndPointValue()]) || !is_singular('post')) {
            return;
        }
        wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/prep-link.js', array('jquery'), $this->version, false);
    }

    public function preplink_rewrite_endpoint()
    {
        add_rewrite_endpoint($this->getEndPointValue(), EP_PERMALINK | EP_PAGES );

        add_filter( 'template_include', function( $template ) {
            global $wp_query;

            if (isset($wp_query->query_vars[$this->getEndPointValue()]) && is_singular('post')) {
                return dirname( __FILE__ ) . '/templates/preplink_template.php';
            }

            return $template;
        });
    }

    /**
     * @return mixed|string
     */
    public function getEndPointValue()
    {
        $endpoint = 'download';
        $settings = get_option('preplink_setting');
        if (!empty($settings['preplink_endpoint'])) {
            $endpoint = preg_replace('/[^\p{L}a-zA-Z0-9_\-.]/u', '', trim($settings['preplink_endpoint']));
        }

        return $endpoint;
    }

    public function add_prep_custom_styles()
    {
        $settings = get_option('preplink_setting');
        if (!empty($settings['preplink_custom_style'])) {
            ?>
            <style><?= $settings['preplink_custom_style'] ?></style>
            <?php
        }
    }
}
