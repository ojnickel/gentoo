-- wordpress.lua comprehensive snippets
local ls = require("luasnip")
local s = ls.snippet
local t = ls.text_node
local i = ls.insert_node
local c = ls.choice_node

-- WordPress PHP snippets
ls.add_snippets("php", {
  -- Basic WordPress functions
  s("wpt", { t("<?php the_title(); ?>") }),
  s("wpc", { t("<?php the_content(); ?>") }),
  s("wpe", { t("<?php the_excerpt(); ?>") }),
  s("wpa", { t("<?php the_author(); ?>") }),
  s("wpd", { t("<?php the_date(); ?>") }),
  s("wpp", { t("<?php the_permalink(); ?>") }),
  s("wpf", { t("<?php the_post_thumbnail(); ?>") }),
  
  -- WP_Query
  s("wpq", {
    t("$"), i(1, "query"), t(" = new WP_Query(array("), t({"", "\t"}),
    t("'post_type' => '"), i(2, "post"), t("',"), t({"", "\t"}),
    t("'posts_per_page' => "), i(3, "10"), t(","), t({"", "\t"}),
    t("'meta_query' => array("), t({"", "\t\t"}),
    t("array("), t({"", "\t\t\t"}),
    t("'key' => '"), i(4, "meta_key"), t("',"), t({"", "\t\t\t"}),
    t("'value' => '"), i(5, "meta_value"), t("',"), t({"", "\t\t\t"}),
    t("'compare' => '='"), t({"", "\t\t"}),
    t(")"), t({"", "\t"}),
    t(")"), t({"", ""}),
    t("));")
  }),
  
  -- WordPress Loop
  s("wpl", {
    t("if (have_posts()) : while (have_posts()) : the_post();"), t({"", "\t"}),
    i(1, "// Loop content"), t({"", ""}),
    t("endwhile; endif;")
  }),
  
  -- Custom Post Type
  s("wpcpt", {
    t("function register_"), i(1, "custom_post_type"), t("() {"), t({"", "\t"}),
    t("$args = array("), t({"", "\t\t"}),
    t("'public' => true,"), t({"", "\t\t"}),
    t("'label' => '"), i(2, "Custom Posts"), t("',"), t({"", "\t\t"}),
    t("'menu_icon' => 'dashicons-admin-post',"), t({"", "\t\t"}),
    t("'supports' => array('title', 'editor', 'thumbnail')"), t({"", "\t"}),
    t(");"), t({"", "\t"}),
    t("register_post_type('"), i(3, "custom_post"), t("', $args);"), t({"", ""}),
    t("}"), t({"", ""}),
    t("add_action('init', 'register_"), ls.f(function(args) return args[1][1] end, {1}), t("');")
  }),
  
  -- Enqueue Scripts
  s("wpenq", {
    t("function "), i(1, "theme"), t("_enqueue_scripts() {"), t({"", "\t"}),
    t("wp_enqueue_style('"), i(2, "theme-style"), t("', get_stylesheet_uri());"), t({"", "\t"}),
    t("wp_enqueue_script('"), i(3, "theme-script"), t("', get_template_directory_uri() . '/js/"), i(4, "script.js"), t("', array('jquery'), '1.0', true);"), t({"", ""}),
    t("}"), t({"", ""}),
    t("add_action('wp_enqueue_scripts', '"), ls.f(function(args) return args[1][1] end, {1}), t("_enqueue_scripts');")
  }),
  
  -- WordPress Hook
  s("wphook", {
    t("add_action('"), i(1, "init"), t("', '"), i(2, "function_name"), t("');")
  }),
  
  -- WordPress Filter
  s("wpfilter", {
    t("add_filter('"), i(1, "the_content"), t("', '"), i(2, "function_name"), t("');")
  }),
  
  -- Meta Box
  s("wpmeta", {
    t("function add_"), i(1, "custom"), t("_meta_box() {"), t({"", "\t"}),
    t("add_meta_box("), t({"", "\t\t"}),
    t("'"), i(2, "meta_box_id"), t("',"), t({"", "\t\t"}),
    t("'"), i(3, "Meta Box Title"), t("',"), t({"", "\t\t"}),
    t("'"), i(4, "meta_box_callback"), t("',"), t({"", "\t\t"}),
    t("'"), i(5, "post"), t("'"), t({"", "\t"}),
    t(");"), t({"", ""}),
    t("}"), t({"", ""}),
    t("add_action('add_meta_boxes', 'add_"), ls.f(function(args) return args[1][1] end, {1}), t("_meta_box');")
  }),
})

-- HTML snippets
ls.add_snippets("html", {
  s("html5", {
    t("<!DOCTYPE html>"), t({"", ""}),
    t("<html lang=\""), i(1, "en"), t("\">"), t({"", ""}),
    t("<head>"), t({"", "\t"}),
    t("<meta charset=\"UTF-8\">"), t({"", "\t"}),
    t("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"), t({"", "\t"}),
    t("<title>"), i(2, "Document"), t("</title>"), t({"", ""}),
    t("</head>"), t({"", ""}),
    t("<body>"), t({"", "\t"}),
    i(3), t({"", ""}),
    t("</body>"), t({"", ""}),
    t("</html>")
  }),
  
  s("wptheme", {
    t("<!DOCTYPE html>"), t({"", ""}),
    t("<html <?php language_attributes(); ?>>"), t({"", ""}),
    t("<head>"), t({"", "\t"}),
    t("<meta charset=\"<?php bloginfo('charset'); ?>\">"), t({"", "\t"}),
    t("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"), t({"", "\t"}),
    t("<?php wp_head(); ?>"), t({"", ""}),
    t("</head>"), t({"", ""}),
    t("<body <?php body_class(); ?>>"), t({"", "\t"}),
    i(1), t({"", "\t"}),
    t("<?php wp_footer(); ?>"), t({"", ""}),
    t("</body>"), t({"", ""}),
    t("</html>")
  })
})

-- CSS/SCSS snippets
ls.add_snippets("css", {
  s("flex", {
    t("display: flex;"), t({"", ""}),
    t("justify-content: "), i(1, "center"), t(";"), t({"", ""}),
    t("align-items: "), i(2, "center"), t(";")
  }),
  
  s("grid", {
    t("display: grid;"), t({"", ""}),
    t("grid-template-columns: "), i(1, "1fr 1fr"), t(";"), t({"", ""}),
    t("gap: "), i(2, "1rem"), t(";")
  }),
  
  s("media", {
    t("@media ("), c(1, {t("max-width"), t("min-width")}), t(": "), i(2, "768px"), t(") {"), t({"", "\t"}),
    i(3), t({"", ""}),
    t("}")
  })
})

-- JavaScript snippets
ls.add_snippets("javascript", {
  s("jqready", {
    t("jQuery(document).ready(function($) {"), t({"", "\t"}),
    i(1), t({"", ""}),
    t("});")
  }),
  
  s("ajax", {
    t("$.ajax({"), t({"", "\t"}),
    t("url: '"), i(1, "/wp-admin/admin-ajax.php"), t("',"), t({"", "\t"}),
    t("type: '"), i(2, "POST"), t("',"), t({"", "\t"}),
    t("data: {"), t({"", "\t\t"}),
    t("action: '"), i(3, "action_name"), t("',"), t({"", "\t\t"}),
    t("nonce: '"), i(4, "nonce_value"), t("'"), t({"", "\t"}),
    t("},"), t({"", "\t"}),
    t("success: function(response) {"), t({"", "\t\t"}),
    i(5), t({"", "\t"}),
    t("}"), t({"", ""}),
    t("});")
  })
})

-- TypeScript snippets
ls.add_snippets("typescript", {
  s("interface", {
    t("interface "), i(1, "InterfaceName"), t(" {"), t({"", "\t"}),
    i(2), t({"", ""}),
    t("}")
  }),
  
  s("type", {
    t("type "), i(1, "TypeName"), t(" = "), i(2, "string"), t(";")
  })
})
