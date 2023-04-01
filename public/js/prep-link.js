/**
 * Script cho riêng trang /download (endpoint) nếu bạn có thể cập nhật code,
 * hoặc thêm mới các tính năng, fix bug, chính sửa các tính năng
 * Vui lòng chia sẻ tới cộng đồng bằng cách gửi pull request trên branch mới.
 *
 * @link       https://github.com/itsmeit268/preplink
 * @author     itsmeit <itsmeit.biz@gmail.com>
 * Website     https://itsmeit.co | https://itsmeit.biz
 */

(function ($) {
    'use strict';
    $(function () {
        var $hiddenLink = $('.link-session-expired');
        var urlParams = new URLSearchParams(window.location.search);
        var preUrlGo = urlParams.get('id');
        var $progress = $('#progress');
        var time_cnf = parseInt(prep_vars.countdown_endpoint);
        var auto_direct = parseInt(prep_vars.endpoint_direct);
        var current_url = window.location.href.replace(/#.*/, '');

        function _update_link_direct()
        {
            var decodedUrl = window.atob(preUrlGo);
            return window.location.replace(decodedUrl);
        }

        //Nếu link download không tồn tại thì chuyển hướng về trang ban đầu
        function backOriginalLink() {
            if ($hiddenLink.length) {
                setTimeout(function () {
                    window.location.replace($hiddenLink.attr('href'));
                }, 5000);
            }
        }

        //FAQ này lấy cấu trúc từ rankmath seo
        function faqQuestion() {
            if ($('.faq-download').length) {
                $('.rank-math-question').click(function (event) {
                    if (!$(this).parent().find('.rank-math-answer ').is(":visible")) {
                        $('.rank-math-question').removeClass('faq-active');
                        $(this).addClass('faq-active');
                        $('.rank-math-answer ').hide();
                    } else {
                        $(this).removeClass('faq-active');
                    }
                    $(this).parent().find('.rank-math-answer ').toggle(300);
                });
            }
        }

        function scrollToProgressElm() {
            $('.clickable').on('click', function () {
                if (time_cnf === 0) {
                    window.location.href = preUrlGo.atob(preUrlGo);
                    return;
                }
                $progress.trigger('click');
                $('html, body').animate({
                    scrollTop: $progress.offset().top - 150
                }, 100);
            });
        }

        /**
         * Chức năng xử lý sự kiện click để download/nhận liên kết */
        function progressRunning(){
            if (time_cnf > 0){
                var isProgressRunning = false;
                $progress.on('click', function (e) {
                    e.preventDefault();
                    var $progress = $(this);
                    $progress.show();

                    if (isProgressRunning) {
                        return;
                    }
                    isProgressRunning = true;

                    var html = '<div id="download-button" class="download-button">';
                    html += '<i class="material-icons">';
                    html += '<svg class="icon" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"></path></svg>';
                    html += '</i>Download</div>';

                    const $counter = $('.counter');
                    const startTime = new Date().getTime();
                    const totalTime = time_cnf * 1000;
                    let isCountdownFinished = false;

                    function updateProgress() {
                        const currentTime = new Date().getTime();
                        const timeRemaining = totalTime - (currentTime - startTime);

                        if (timeRemaining <= 0) {
                            $counter.html('');
                            $counter.html(html);
                            clearInterval(interval);
                            isCountdownFinished = true;
                            isProgressRunning = false;
                            $progress.off('click');
                            if (auto_direct){
                                _update_link_direct();
                            }
                        } else if (!isCountdownFinished) {
                            const percent = Math.floor((1 - timeRemaining / totalTime) * 100);
                            $('.bar').css('width', percent + '%');
                            $counter.html(percent + '%');
                        }

                        if (isCountdownFinished) {
                            $('.bar').css('width', '100%');
                        }
                    }

                    let interval = setInterval(updateProgress, 10);
                    setTimeout(() => clearInterval(interval), totalTime);

                    $counter.on('click', function (e) {
                        if (!isCountdownFinished) {
                            e.preventDefault();
                        } else {
                            _update_link_direct();
                        }
                    });
                });
            }
        }

        faqQuestion();
        scrollToProgressElm();
        progressRunning();
        backOriginalLink();
    });
})(jQuery);
