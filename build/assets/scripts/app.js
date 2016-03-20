$(function(){
	// CUSTOM MODAL FORMS
	var febModal = {
		init: function (targetId) {
			this.targetId = targetId;
			this.targetHtml = $(targetId+'Tpl').html();
			this.loadHtml();
			this.initEvents();
		},

		loadHtml: function () {
			$('body').append(this.targetHtml);
		},

		cleanHtml: function () {
			$(this.targetId).remove();
		},

		initEvents: function() {
			$(this.targetId).modal('show');

			// inputmask init
			$(this.targetId + ' .inputmask').inputmask();

			// close modal event
			$(this.targetId).on('hidden.bs.modal', function () {
				febModal.cleanHtml();
			});

			// ajax form submit event
			$(this.targetId + ' form.js-ajax-form').on('submit', function(e) {
				e.preventDefault();

				var formWrap = $(this).parents('.ajax-form');
				var formData = $(this).serializeArray();
				var jsonData = {};

				for (var i in formData) {
					var item = formData[i];
					jsonData[item.name] = item.value;
				}

				$.ajax({
					url: '/taxi/public/statement?native=true',
					type: "POST",
					data: JSON.stringify(jsonData),
					contentType: "application/json; charset=utf-8"
				})
				.done(function() {
					$(formWrap).addClass("ajax-form_completed");
				})
				.fail(function() {
					alert('Проблемы с соединением. Заявка не была отправлена.');
				});

			});
		},
	};

	// BOOTSTRAP CUSTOM MODALS
		$('[data-modal]').click(function(e) {
			var targetId  = $(this).data('modal');
			febModal.init(targetId);
		});

	// SMOOTH SCROLL TO ANCHORS
		$(".js-anchor").click(function (e) {
			e.preventDefault();

			var targetId     = $(this).attr('href'),
			    targetY      = $(targetId).offset().top,
			    headerH      = $('header').outerHeight();

			// т.к. высота хедера в обычном состоянии (headerH) не равна
			// высоте фиксированного хедера (fixedHeaderH)
			// то и вертикальное положение блоков,
			// до которых нужно отскролить страницу соответственно отличается.

			var fixedHeaderH = 66, // высота фиксированного хедера
			    headersDiff  = headerH-fixedHeaderH, // разница между высотами хедеров
			    scrollPos    = targetY-headerH-headersDiff; // на сколько нужно отскролить страницу

			$('body,html').animate({scrollTop: scrollPos}, 600);
		});

	// FIXED HEADER ON SCROLL
		$(window).scroll(function(){
			var header       = $('header'),
			    headerH      = header.outerHeight(),
			    windowScroll = $(window).scrollTop();

			if (windowScroll > (headerH + 100)) {
				header.addClass('fixed-header');
			}
			else {
				header.removeClass('fixed-header');
			}
		});

	// SEND SMS FORM
		$('#sendSmsBtn').click(function(e) {
			var phoneNum = '7' + $('#sendSmsPhone').inputmask('unmaskedvalue'),
			    url      = '/taxi/rest/public/link/' + phoneNum;

			$.ajax({
				url: url,
				type: 'POST'
			})
			.done(function() {
				alert('Сообщение отправлено.');
			})
			.fail(function() {
				alert('Проблемы с соединением. Сообщение не отправлено.');
			});

		});

});
$(function(){
	// Init mask on input.inputmask
	$(".inputmask").inputmask();
});