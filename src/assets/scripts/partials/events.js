$(function(){
	var febModal = {
		init: function (targetId, targetTpl) {
			this.targetId = targetId;
			this.targetHtmlId = $(targetId+'Tpl');
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
			$(this.targetId).on('hidden.bs.modal', function () {
				febModal.cleanHtml();
			});

			$('.js-ajax-form').on('submit', function(e) {
				e.preventDefault();

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
					contentType: "application/json; charset=utf-8",
					dataType: "json"
				}).done(function() {
					$(this).parents('.ajax-form').addClass("ajax-form_completed");
				});
			});
		},
	};

	// BOOTSTRAP CUSTOM MODALS
		$('[data-modal]').click(function(e) {
			var targetId  = $(this).data('modal'),
			    targetTpl = targetId + 'Tpl';

			febModal.init(targetId, targetTpl);
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

});