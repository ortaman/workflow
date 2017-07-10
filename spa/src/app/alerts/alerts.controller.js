
app.controller('AlertsController', ['$scope', '$timeout',
 function($scope, $timeout) {

       $scope.options = {
         debug: true,
         timenav_position: 'top',
         language: 'es'
       };

       $timeout(function () {
         var data = {
           'title': {
             'media': {
               'url': 'images/input.png',
               'caption': 'From punch cards to multi touch.',
               'credit': 'Arjuna Soriano'
             },
             'text': {
               'headline': 'Revolutionary User Interfaces',
               'text': '<p>The human computer interface helps to define computing at any one time. As computers have become more mainstream the interfaces have become more intimate. This is the journey of computer technology and how it has come to touch all of our lives.</p>'
             }
           },
           'events': [{
             'media': {
               'url': 'https://youtu.be/DiQSHiAYt98',
               'caption': '',
               'credit': '<a href=\'http://www.nature.com/nature/videoarchive/index.html\'>Nature Video Channel</a>'
             },
             'start_date': {
               'year': '1610',
               'month': '2',
               'day': '1'
             },
             'end_date': {
               'year': '1630',
               'month': '2',
               'day': '1'
             },
             'text': {
               'headline': 'The Antikythera',
               'text': 'In the year 1900, sponge divers discovered the Antikythera Mechanism, a remarkable mechanical computer used to track the cycles of the solar system dated to as early as 89 B.C. There was no input however. All computations were carried out by the intricate system of clockwork like plates and wheels..'
             },
             group: 'demo-group1'
           }, {
             'test': 'a text received from server',
             'videoUrl': 'http://www.w3schools.com/html/mov_bbb.mp4',
             'media': {
               'url': '<demo video-url="data.videoUrl"></demo>',
               'caption': '<span>{{model.test}}</span>'
             },
             'start_date': {
               'year': '1610',
               'month': '2',
               'day': '1'
             },
             'end_date': {
               'year': '1630',
               'month': '2',
               'day': '1'
             },
             'text': {
               'headline': 'DEMO: {{data.test}}',
               'text': 'This is the demo text with a link to angular data (<a ng-href="{{data.videoUrl}}">source</a>)'
             },
             group: 'demo-group2'
           }, {
             'media': {
               'url': 'images/input.png',
               'caption': 'This piece is on display at Mus\u00e9e des Arts et M\u00e9tiers, Paris.',
               'credit': '\u00a9 2005 <a href=\'http://commons.wikimedia.org/wiki/User:David.Monniaux\'>David Monniaux</a>  '
             },
             'start_date': {
               'year': '1610',
               'month': '2',
               'day': '1'
             },
             'end_date': {
               'year': '1630',
               'month': '2',
               'day': '1'
             },
             'text': {
               'headline': 'Pascal\'s Calculator',
               'text': '<p>Blaise Pascal invented this calculator to help his father reorganize the French tax system. It could add and subtract in one step and multiply and divide by repetition.</p><p>Input was achieved by spinning the little wheels: inspiration for the iPod click wheel?</p>'
             },
             group: 'demo-group1'
           }]
         };

         $scope.timeline.setData(data);
         $scope.timeline.goTo(1);
       }, 200);

       $scope.$watch('options', function(newOptions) {
         if($scope.timeline) {
           $scope.timeline.setOptions(newOptions);
         }
       }, true);

}]);
