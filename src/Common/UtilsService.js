const UtilsService = {

    getEventExtraSettingsAsObj(eventsList) {
        for (let i=0; i < eventsList.length; i++) {
          const extraSettingsObject = { 
            areSpeakersAllowed: eventsList[i].areSpeakersAllowed,
            areReviewersAllowed: eventsList[i].areReviewersAllowed,
            areAuthorsAllowed: eventsList[i].areAuthorsAllowed,
            isPollingAllowed: eventsList[i].isPollingAllowed,
            isPollingAllowedForUsers: eventsList[i].isPollingAllowedForUsers,
            areStatisticsAllowed: eventsList[i].areStatisticsAllowed,
            areStatisticsAllowedForUsers: eventsList[i].areStatisticsAllowedForUsers,
            showEventLocation: eventsList[i].showEventLocation,
            arePostsAllowed: eventsList[i].arePostsAllowed,
            areCommentsAllowed: eventsList[i].areCommentsAllowed,
            allowUsersToChatAmongThemselves: eventsList[i].allowUsersToChatAmongThemselves,
            allowUsersToChatWithSpeakers: eventsList[i].allowUsersToChatWithSpeakers,
            allowUsersToChatWithReviewers: eventsList[i].allowUsersToChatWithReviewers,
            allowUsersToChatWithAuthors: eventsList[i].allowUsersToChatWithAuthors,
            allowUsersToAskQuestions: eventsList[i].allowUsersToAskQuestions,
            showEventLocationDetails: eventsList[i].showEventLocationDetails,
            eventType: eventsList[i].eventType,
            isExpired: eventsList[i].isExpired,
          }
          delete eventsList[i].areSpeakersAllowed,
          delete eventsList[i].areReviewersAllowed,
          delete eventsList[i].areAuthorsAllowed,
          delete eventsList[i].isPollingAllowed,
          delete eventsList[i].isPollingAllowedForUsers,
          delete eventsList[i].areStatisticsAllowed,
          delete eventsList[i].areStatisticsAllowedForUsers,
          delete eventsList[i].showEventLocation,
          delete eventsList[i].arePostsAllowed,
          delete eventsList[i].areCommentsAllowed,
          delete eventsList[i].allowUsersToChatAmongThemselves,
          delete eventsList[i].allowUsersToChatWithSpeakers,
          delete eventsList[i].allowUsersToChatWithReviewers,
          delete eventsList[i].allowUsersToChatWithAuthors,
          delete eventsList[i].allowUsersToAskQuestions,
          delete eventsList[i].showEventLocationDetails,
          delete eventsList[i].eventType,
          delete eventsList[i].isExpired,
          eventsList[i].eventExtraSettings = extraSettingsObject;
        }
        return eventsList;
      },

    getRandomNumber() {
          return Math.floor(Math.random() * 10000) + 1;        
    },
}

export default UtilsService;