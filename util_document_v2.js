/*var DEBUG_MODE_ON = true;

if (!DEBUG_MODE_ON) {
	console = console || {};
	console.log = function () { };
}*/



var utilsDocument = (function () {
	function getHandle() {
		console.log('Obteniendo Handle principal');
		return $AR.addJsonReport(reports);
	}
	function getPageTemplates() {
		console.log('Obteniendo Templates');
		return document.querySelectorAll('template');
	}
	function getLayouts() {
		console.log('Obteniendo Layputs');
		console.log(handle.getLayoutElements());
		return handle.getLayoutElements();
	}
	function getLayoutsTabs() {
		var _table = getMyTable(0);
		return _table.dashboardComponent.dashboard.layoutTabs.tabs //solo he visto esta manera de acceder al dashboard tabs
	}
	function getRoot() {
		return document.getElementById('root');
	}
	function getARText() {
		console.log('Obteniendo textos dados en webfocus');
		return LayoutObjects.filter(function (element, i) {
			return element.type == 'string';
		});
	}
	function getARObjects() {
		console.log('Obteniendo objectos dados en webfocus,combos....');
		return LayoutObjects.filter(function (element, i) {
			return element.type != 'image' && element.type != 'string';
		});
	}
	function generatePagesExtruture() {
		console.log('Generando estructura de la pagina');
		var _pages = [];

		function getObjects(numberPage, template) {
			numberPage = numberPage + 1;
			return arrObject.reduce(function (filtered, element) {
				if (element.layout == numberPage) {
					if (template.content.querySelector('div[data-id=' + element.name + ']') != null) {
						console.log(
							'asignando objecct' + element.name + ' a div',
							element.name + ' en pagina ' + element.layout
						);
						var newElement = {
							filter: element,
							container: template.content.querySelector('div[data-id=' + element.name + ']'),
						};
						filtered.push(newElement);
					} else {
						console.warn('No existe div en el template para el objecto ' + element.name);
					}
				}
				return filtered;
			}, []);
		}

		function getReports(layout, template) {
			return layout.reports.reduce(function (filtered, element) {
				console.log('asignando report ' + element.table_name + ' a div', element, layout);
				if (template.content.querySelector('div[data-id=' + element.table_name + ']') != null) {
					var newElement = {
						report: element,
						container: template.content.querySelector('div[data-id=' + element.table_name + ']'),
					};
					filtered.push(newElement);
				} else {
					console.warn('No existe div en el template para el report/chart ' + element.table_name);
				}
				return filtered;
			}, []);
		}

		function getText(numberPage, template) {
			numberPage = numberPage + 1;
			return arrText.reduce(function (filtered, element) {
				if (element.layout == numberPage) {
					if (template.content.querySelector('div[data-id=' + element.objname + ']') != null) {
						$('#' + element.divObj.divName).remove();
						console.log(
							'asignando text ' + element.text + ' a div',
							element.objname + ' en pagina ' + element.layout
						);
						var newElement = {
							text: element.text,
							container: template.content.querySelector('div[data-id=' + element.objname + ']'),
						};
						filtered.push(newElement);
					} else {
						console.warn('No existe div en el template para el texto ' + element.objname);
					}
				}
				return filtered;
			}, []);
		}
		function addCustomFuctionReports(reports) {
			reports.forEach(function (element, index) {
				var container = element.container;
				element.report.customResize = function () {
					console.log('resize report ', this, container)


					if (this.a_cntl.reportView == REPORTGRID) {
						this.a_cntl.table_div.width = '100%';
						this.a_cntl.table_div.height = '100%';
						this.a_cntl.table_div.position = 'relative';
						this.a_cntl.table_div.viewPortType = 'DIMENSION';
					}
					//
					var width = $(container).width();
					var height = $(container).height();
					//report.dashboardComponent.appendTo(container).resetPosition();
					setTimeout(() => {
						if (this.a_cntl.reportView != REPORTGRID)
							this.dashboardComponent.appendTo(container).resetPosition().resize(10, 10);
						this.dashboardComponent.appendTo(container).resetPosition().resize(width, height);

					}, 0);
				}
			})
		}
		layouts.forEach(function (element, index) {
			console.log(' extructura de la pagina' + index);

			_pages[index] = {
				pageId: index,
				domObject: null,
				menuObject: null,
				reports: [],
				texts: [],
				objects: [],
			};
			if (templates[index] != undefined) {
				_pages[index].domObject = document.importNode(templates[index].content, true);
				//   root.appendChild(_pages[index].domObject);
				_pages[index].reports = getReports(element, templates[index]);

				_pages[index].texts = getText(index, templates[index]);
				_pages[index].objects = getObjects(index, templates[index]);
				addCustomFuctionReports(_pages[index].reports);
			}
		});
		return _pages;
	}
	function putElements() {

		function putReports(page) {

			page.reports.forEach(function (element, index) {
				var report = element.report;
				var container = element.container;
				if (report.a_cntl.reportView == REPORTGRID) {
					report.a_cntl.table_div.width = '100%';
					report.a_cntl.table_div.height = '100%';
					report.a_cntl.table_div.position = 'relative';
					report.a_cntl.table_div.viewPortType = 'DIMENSION';
				}
				//
				var width = $(container).width();
				var height = $(container).height();
				//report.dashboardComponent.appendTo(container).resetPosition();
				setTimeout(() => {
					if (report.a_cntl.reportView != REPORTGRID)

						report.dashboardComponent.appendTo(container).resetPosition().resize(10, 10);
					report.dashboardComponent.appendTo(container).resetPosition().resize(width, height);

				}, 0);
				//report.dashboardComponent.appendTo(container).resetPosition().resize(width, height);
			});
		}
		function putTexts(page) {
			page.texts.forEach(function (element, index) {
				var text = element.text;
				var container = element.container;
				container.innerHTML = text;
			});
		}
		function putObjects(page) {
			page.objects.forEach(function (element, index) {
				var container = element.container;
				var obj = $('#' + element.filter.divObj.divName).get(0);
				obj.removeAttribute('style');
				container.append(obj);
			});
		}

		console.log('colocando Elementos');


		arrPages.forEach(function (element, index) {
			$('#calculando').show();
			console.log(element);
			putReports(element);
			putTexts(element);
			putObjects(element);
			$('#calculando').hide();
		});


	}
	function _getReport(report) {
		for (var i = 0; i < arrPages.length; i++) {
			for (var j = 0; j < arrPages[i].reports.length; j++) {
				if ($(arrPages[i].reports[j].container).attr('data-id') === report) {
					return arrPages[i].reports[j].report
				}
			}
		}
		return null;
	}
	function deleteNotTemplate() {
		dashboard = document.getElementById('ARDashboard');
		$(dashboard)
			.find('[id ^= "ARDashboard_layout_"][id $="_content"][class!=content]')
			.each(function (index, element) {
				$(this).find('> div[data-role!=template]').remove();
			});
	}

	function assignTemplates() {
		dashboard = document.getElementById('ARDashboard');
		$(dashboard)
			.find('[id ^= "ARDashboard_layout_"][id $="_content"][class!=content]')
			.each(function (index, element) {
				if (templates[index] != undefined) {
					$(this).append(templates[index].content);
					$(this).addClass('template-parent');
				}
			});
	}
	function changeTabEvent() {
		/*   $('.arDashboardBarButton')
				   .click(function () {
					   putElements();
				   });*/
		$('html > body').on('click', '.arDashboardBarButton', function () {
			putElements();

		});
	}
	function _gotoTab(number) {
		layoutTabs[number].select()


		putElements();

	}
	function calculateDiv() {
		$('body').append('<div id=calculando style="z-index:9999;background: red;position:absolute;top:0px;bottom:0px;right:0px;left:0px;display:none"></div>')
	}
	function inicialitate(resolve, reject) {
		calculateDiv();
		console.log('Inicianzo colocacion');
		handle = getHandle();
		templates = getPageTemplates();
		root = getRoot();
		arrText = getARText();
		arrObject = getARObjects();
		layouts = getLayouts();
		layoutTabs = getLayoutsTabs();
		top.KK = layouts;
		top.KK2 = handle;
		top.KK3 = root;
		arrPages = generatePagesExtruture();
		top.KK4 = arrPages;
		top.KK5 = layoutTabs;
		//para poner el titulo es  $AR.dashboard.reportComponents[0][0].tableTitleTextContainer.classList.remove("hidden");

		document.addEventListener('arDashboardLoaded', function () {

			assignTemplates()
			putElements();
			deleteNotTemplate();
			changeTabEvent();
			var myObserver = new ResizeObserver((entries) => {
				putElements();
			});
			var divObserver = document.getElementById('ARDashboard');
			myObserver.observe(divObserver);
			resolve('dd')
			//no me convence
		});

		document.addEventListener('arMinimizeDashboard', function (e) {
			if (!$AR.dashboard.inMaximizedMode) {
				putElements();
			}
		});

		document.addEventListener('arMaximizeDashboard', function (e) {
			$AR.dashboard.measure();
		});
	}
	function _init() {
		return new Promise((resolve, reject) => {
			inicialitate(resolve, reject);
		})
	}
	var handle, templates, root, arrText, arrObject, layouts, arrPages, layoutTabs;
	return {
		init: _init,
		gotoTab: _gotoTab,
		putElements: putElements,
		getReport: _getReport
	}
})();
