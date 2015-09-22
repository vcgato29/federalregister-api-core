require 'ruby-debug'
require 'spec_helper'

describe IssueReprocessor::ModsDownloader do

  describe ".create_diff" do
    include FileIoSpecHelperMethods

    let(:spec_current_mods_path)   { File.join('data','mods') }
    let(:spec_temporary_mods_path) { File.join('data','mods','tmp') }
    let(:spec_mods_archive_path)   { File.join('data','mods','archive') }

    before(:each) do
      @issue = Issue.create(:publication_date => "2099-01-01".to_date)
      @reprocessed_issue = ReprocessedIssue.new
      @reprocessed_issue.issue = @issue
      @reprocessed_issue.save
    end

    after(:each) do
      delete_file('data/mods/2099-01-01.xml')
      delete_file('data/mods/tmp/2099-01-01.xml')
    end

    it ".create_diff returns an empty string if the files are the same" do
      original_xml = "<XML></XML>"
      modified_xml = "<XML></XML>"
      create_file("data/mods/2099-01-01.xml", original_xml)
      create_file("data/mods/tmp/2099-01-01.xml", modified_xml)

      mods_downloader = IssueReprocessor::ModsDownloader.new(@reprocessed_issue.id)
      mods_downloader.create_diff
      @reprocessed_issue.reload.diff.should == ""
    end

    it ".create_diff returns a diff if the files are different" do
      original_xml = "<XML></XML>"
      modified_xml = "<XML>New Stuff</XML>"
      create_file("data/mods/2099-01-01.xml", original_xml)
      create_file("data/mods/tmp/2099-01-01.xml", modified_xml)

      mods_downloader = IssueReprocessor::ModsDownloader.new(@reprocessed_issue)
      mods_downloader.create_diff
      @reprocessed_issue.reload.diff.should be_present
    end

  end

end
