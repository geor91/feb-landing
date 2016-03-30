$(function(){
	// BOOTSTRAP CUSTOM MODALS
		$('[data-modal]').click(function(e) {
			var targetId  = $(this).data('modal');
			febModal.init(targetId);
		});

	// SMOOTH SCROLL TO ANCHORS
		$(".js-anchor").click(function (e) {
			e.preventDefault();

			var targetId     = $(this).attr('href').slice(1),
			    targetY      = document.getElementById(targetId).offsetTop,
			    headerH      = $('header').outerHeight(),
			    scrollPos    = targetY - headerH;

			$('body,html').animate({scrollTop: scrollPos}, 600);
		});

	// FIXED HEADER ON SCROLL
		$(window).scroll(function(){
			var header       = $('header'),
			    headerH      = header.outerHeight(),
			    windowScroll = $(window).scrollTop();

			if (windowScroll > (headerH*2)) {
				header.addClass('fixed-header');
			}
			else {
				header.removeClass('fixed-header');
			}
		});

	// CUSTOM MODAL FORMS
		var febModal = {
			init: function (targetId) {
				this.targetId = targetId;
				this.targetHtml = $(targetId+'Tpl').html();
				this.appendModal();
				this.initEvents();
			},

			appendModal: function () {
				$('body').append(this.targetHtml);
			},

			removeModal: function () {
				$(this.targetId).remove();
			},

			initEvents: function() {
				$(this.targetId).modal('show');

				// mask for inputs
				$(this.targetId + ' .inputmask').inputmask();

				// close modal
				$(this.targetId).on('hidden.bs.modal', function () {
					febModal.removeModal();
				});

				// ajax form submit
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

	// SEND SMS FORM
		$('#getDLink').submit(function(e) {
			e.preventDefault();
			var self       = $(this),
					formInput  = self.children('#sendSmsPhone'),
					formSubmit = self.children('#sendSmsBtn'),
					formResult = self.children('.app-get-sms__status'),
			    formData   = formInput.inputmask('unmaskedvalue');

			if (formData) {
				// phone num validation
				if (formData.length != 10) {
					formSubmit.attr('disabled', 'disabled');
					formResult.addClass('alert-danger')
						.text('Неверный формат.').show();
					setTimeout(function() {
						formResult.removeClass('alert-danger').hide().text('');
						formSubmit.removeAttr('disabled');
					}, 3000);
					return false;
				}

				var url = '/taxi/rest/public/link/' + '7' + formData;

				$.ajax({
					url: url,
					type: 'POST'
				})
				.done(function() {
					formInput.val('');
					formSubmit.attr('disabled', 'disabled');
					formResult.addClass('alert-success')
						.text('Сообщение отправлено.').show();
					setTimeout(function() {
						formResult.removeClass('alert-success').hide().text('');
						formSubmit.removeAttr('disabled');
					}, 5000);
				})
				.fail(function() {
					formSubmit.attr('disabled', 'disabled');
					formResult.addClass('alert-danger')
						.text('Сообщение не отправлено.').show();
					setTimeout(function() {
						formResult.removeClass('alert-danger').hide().text('');
						formSubmit.removeAttr('disabled');
					}, 2000);
				});
			}

		});

});