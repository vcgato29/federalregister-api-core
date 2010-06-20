class Admin::EventsController < AdminController
  def index
    @events = Event.all
  end
  
  def new
    @event = Event.new(params[:event])
    @event.title ||= @event.entry.try(:title)
    render :layout => !request.xhr?
  end
  
  def create
    @event = Event.new(params[:event])
    
    if @event.save
      if request.xhr?
        render :partial => "list_item", :locals => {:event => @event}, :layout => false
      else
        flash[:notice] = "Successfully created."
        redirect_to admin_events_url
      end
    else
      if request.xhr?
        render :action => :new, :layout => false, :status => :conflict
      else
        flash.now[:error] = "There was a problem."
        render :action => :new
      end
    end
  end
  
  def edit
    @event = Event.find(params[:id])
  end
  
  def update
    @event = Event.find(params[:id])
    
    if @event.update_attributes(params[:event])
      flash[:notice] = "Successfully updated."
      redirect_to admin_events_url
    else
      flash.now[:error] = "There was a problem."
      render :action => :edit
    end
  end
  
  def destroy
    @event = Event.find(params[:id])
    @event.destroy
    
    if request.xhr?
        render :nothing => true 
      else
        flash[:notice] = "Successfully removed."
        redirect_to admin_events_url
    end
  end
end