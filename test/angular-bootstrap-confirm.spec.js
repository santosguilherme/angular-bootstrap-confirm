describe('Confirm popover', function() {

  beforeEach(module('mwl.confirm'));

  beforeEach(module(function($provide) {

    $provide.factory('$position', function() {
      return {
        positionElements: function() {
          return {
            top: 10,
            left: 50
          };
        }
      };
    });

  }));

  describe('PopoverConfirmController', function() {

    var ctrl, scope, element, popover;

    beforeEach(inject(function($controller, $rootScope) {

      scope = $rootScope.$new();
      element = angular.element('<button>Test</button>');
      ctrl = $controller('PopoverConfirmController as vm', {
        $scope: scope,
        $element: element
      });
      popover = $('body').find('.popover:first');

    }));

    afterEach(function() {
      scope.$destroy();
    });

    it('should set an id on the element if it isnt set', function() {
      expect(element.attr('id')).to.be.defined;
      expect(element.attr('id')).to.equal('popover-trigger-0');
    });

    describe('showPopover', function() {

      it('should show the popover', function() {
        expect(popover.is(':visible')).to.be.false;
        scope.vm.showPopover();
        expect(popover.is(':visible')).to.be.true;
      });

    });

    describe('hidePopover', function() {

      it('should hide the popover', function() {
        expect(popover.is(':visible')).to.be.false;
        scope.vm.showPopover();
        expect(popover.is(':visible')).to.be.true;
        scope.vm.hidePopover();
        expect(popover.is(':visible')).to.be.false;
      });

    });

    describe('togglePopover', function() {

      it('should show the popover if hidden', function() {
        expect(popover.is(':visible')).to.be.false;
        scope.vm.togglePopover();
        expect(popover.is(':visible')).to.be.true;
      });

      it('should hide the popover if visible', function() {
        scope.vm.showPopover();
        expect(popover.is(':visible')).to.be.true;
        scope.vm.togglePopover();
        expect(popover.is(':visible')).to.be.false;
      });

    });

    describe('positionPopover', function() {

      beforeEach(function() {
        scope.vm.showPopover();
      });

      it('should set the top css property', function() {
        //TODO
      });

      it('should set the left css property', function() {
        //TODO
      });

    });

    describe('element click', function() {

      it('should show the popover when the element is clicked and the element is hidden', function() {
        expect(popover.is(':visible')).to.be.false;
        $(element).click();
        expect(popover.is(':visible')).to.be.true;
      });

      it('should hide the popover when the element is clicked and the element is visible', function() {
        scope.vm.showPopover();
        expect(popover.is(':visible')).to.be.true;
        $(element).click();
        expect(popover.is(':visible')).to.be.false;
      });

    });

    describe('window resize', function() {

      it('should reposition the popover when the window resizes', function() {
        //TODO
      });

    });

    describe('$destroy', function() {

      it('should remove the popover when the scope is destroyed', function() {
        scope.$destroy();
        expect($('body').find('.popover').size()).to.equal(0);
      });

    });

  });

  describe('mwlConfirmDirective', function() {

    var element, scope, $compile;

    beforeEach(inject(function(_$compile_, $rootScope) {
      scope = $rootScope.$new();
      $compile = _$compile_;
    }));

    afterEach(function() {
      scope.$destroy();
      $('body').find('.popover').remove();
    });

    function createPopover(htmlString) {
      element = angular.element(htmlString);
      $compile(element)(scope);
      scope.$digest();
      return $('body').find('.popover:first');
    }

    it('should set the default confirm text', function() {

      var popover = createPopover('<button mwl-confirm>Test</button>');
      expect($(popover).find('.btn:first').text()).to.equal('Confirm');

    });

    it('should set the confirm text when specified', function() {
      var popover = createPopover('<button mwl-confirm confirm-text="Different confirm text">Test</button>');
      expect($(popover).find('.btn:first').text()).to.equal('Different confirm text');
    });

    it('should set the default cancel text', function() {
      var popover = createPopover('<button mwl-confirm>Test</button>');
      expect($(popover).find('.popover-content .row :nth-child(2) .btn').text()).to.equal('Cancel');
    });

    it('should set the cancel text when specified', function() {
      var popover = createPopover('<button mwl-confirm cancel-text="Different cancel text">Test</button>');
      expect($(popover).find('.popover-content .row :nth-child(2) .btn').text()).to.equal('Different cancel text');
    });

    it('should set the popover message', function() {
      var popover = createPopover('<button mwl-confirm message="Message">Test</button>');
      expect($(popover).find('.popover-content > p').text()).to.equal('Message');
    });

    it('should allow html in the popover message', function() {
      scope.message = '<b>Message<b>'
      var popover = createPopover('<button mwl-confirm message="{{ message }}">Test</button>');
      expect($(popover).find('.popover-content > p > b').size()).to.equal(1);
    });

    it('should set the popover title', function() {
      var popover = createPopover('<button mwl-confirm title="Title">Test</button>');
      expect($(popover).find('.popover-title').text()).to.equal('Title');
    });

    it('should allow html in the popover title', function() {
      scope.title = '<b>Title<b>'
      var popover = createPopover('<button mwl-confirm title="{{ title }}">Test</button>');
      expect($(popover).find('.popover-title > b').size()).to.equal(1);
    });

    it('should set the default placement to top', function() {
      var popover = createPopover('<button mwl-confirm>Test</button>');
      expect($(popover).hasClass('top')).to.be.true;
    });

    it('should set the placement when specified', function() {
      var popover = createPopover('<button mwl-confirm placement="left">Test</button>');
      expect($(popover).hasClass('left')).to.be.true;
    });

    it('should call onConfirm when the confirm button is clicked', function() {
      scope.onConfirm = sinon.spy();
      var popover = createPopover('<button mwl-confirm on-confirm="onConfirm()">Test</button>');
      $(popover).find('.btn:first').click();
      expect(scope.onConfirm).to.have.been.called;
    });

    it('should call onCancel when the cancel button is clicked', function() {
      scope.onCancel = sinon.spy();
      var popover = createPopover('<button mwl-confirm on-cancel="onCancel()">Test</button>');
      $(popover).find('.popover-content .row :nth-child(2) .btn').click();
      expect(scope.onCancel).to.have.been.called;
    });

    it('should set the default confirm button class to danger', function() {
      var popover = createPopover('<button mwl-confirm>Test</button>');
      expect($(popover).find('.btn:first').hasClass('btn-danger')).to.be.true;
    });

    it('should allow html in the confirm button text', function() {
      scope.confirmButtonText = '<b>Confirm</b>';
      var popover = createPopover('<button mwl-confirm confirm-text="{{ confirmButtonText }}">Test</button>');
      expect($(popover).find('.btn:first > b').size()).to.equal(1);
    });

    it('should set confirm button class when specified', function() {
      var popover = createPopover('<button mwl-confirm confirm-button-type="warning">Test</button>');
      expect($(popover).find('.btn:first').hasClass('btn-warning')).to.be.true;
    });

    it('should set the default cancel button class to default', function() {
      var popover = createPopover('<button mwl-confirm>Test</button>');
      expect($(popover).find('.popover-content .row :nth-child(2) .btn').hasClass('btn-default')).to.be.true;
    });

    it('should set cancel button class when specified', function() {
      var popover = createPopover('<button mwl-confirm cancel-button-type="warning">Test</button>');
      expect($(popover).find('.popover-content .row :nth-child(2) .btn').hasClass('btn-warning')).to.be.true;
    });

    it('should allow html in the cancel button text', function() {
      scope.cancelButtonText = '<b>Cancel</b>';
      var popover = createPopover('<button mwl-confirm cancel-text="{{ cancelButtonText }}">Test</button>');
      expect($(popover).find('.popover-content .row :nth-child(2) .btn > b').size()).to.equal(1);
    });

    it('should close the popover when another element that isn\'t the popover is clicked', function() {

    });

    it('should keep the popover open when an element inside the popover is clicked', function() {

    });

    it('should close the popover when the confirm button is clicked', function() {

    });

    it('should close the popover when the cancel button is clicked', function() {

    });

    it('should not throw any errors when the default interpolation symbols are changed', function() {

    });

  });

});