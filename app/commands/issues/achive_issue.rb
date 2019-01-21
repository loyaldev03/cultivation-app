module Issues
  class SaveIssue
    prepend SimpleCommand

    def initialize(args)
      @id = args[:id]
    end

    def call
      archive_issue
    end

    private

    attr_reader :id

    def archive_issue
      issue = Issues::Issue.find(id)
      issue.update!(status: 'archived')
      issue
    end
  end
end
