require "jsduck/tag/member_tag"

class Message < JsDuck::Tag::MemberTag
  def initialize
    @tagname = :message
    @pattern = "message"
    @member_type = {
      :title => "Cloud Messages",
      :position => MEMBER_POS_CFG - 0.1,
      :icon => File.dirname(__FILE__) + "/message.png",
    }
  end

  def parse_doc(scanner, position)
    return {
      :tagname => :message,
      :name => scanner.ident,
    }
  end

  def process_doc(context, message_tags, position)
    context[:name] = message_tags[0][:name]
  end

  def to_html(message, cls)
    member_link(message) + member_params(message[:params])
  end
end